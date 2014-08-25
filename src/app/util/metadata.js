var Trakt = require('trakt'),
    fs = require('fs'),
    Q = require('q'),
    polyfill = require('./polyfill'),
    config = require('./../../config/config'),
    tvTitleCleaner = require('./../../filename-cleaner'),
    async = require('async');

require('./../models/ShowSchema');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');


var Episode = mongoose.model('Episode');

var Show = mongoose.model('Show');


exports.metadata = {

    scanned : 0,
    files : 0,

    /**
     * Indexeer de opgegeven directory. Geef alle bestanden terug die voldoen aan de 'extensions' array.
     *
     * @param dir
     */
    scan : function( dir, callback ) {
        var self = this;
        this.scanned = 0;

        fs.readdir(dir, function(err, files) {
            var returnFiles = [];

            async.each(files, function(file, next) {
                var filePath = dir + '/' + file;

                fs.stat(filePath, function(err, stat) {
                    // fout gevonden
                    if (err) {
                        return next(err);
                    }

                    // is het een directory?
                    if ( stat.isDirectory() ) {
                        // scan deze directory ook
                        self.scan(filePath, function(err, results) {
                            if (err) {
                                return next(err);
                            }

                            returnFiles = returnFiles.concat(results);
                            next();
                        });
                    // is het een bestand?
                    } else if ( stat.isFile() ) {
                        // doorloop de extensie array
                        config.metadata.extensions.forEach( function( extension ) {
                            // bestand komt overeen met file extensie.
                            if ( file.indexOf(extension, file.length - extension.length) !== -1 ) {
                                returnFiles.push( { filename: file, location: filePath } );
                            }
                        });

                        next();
                    }
                });
            }, function(err) {
                callback(err, returnFiles);
            });
        });
    },

    /**
     * Verwerk de resultaten van de gescande directory
     *
     * @param results
     */
    parse : function( results ) {
        var deferred = Q.defer(),
            showData = [],
            self = this;

        this.files = results.length;

        // Haal per bestand het seizoens nummer en episode nummer.
        var process = function(results) {
            if( results && results.length > 0 ) {
                var file = results.pop();

                self.getEpisodeData(file, function (episodeData) {
                    showData.push(episodeData);
                    self.notifyProgress('PARSING');
                    var next = results.length > 0 ? process(results) : deferred.resolve(showData);
                });
            } else {
                // geen bestanden om te parsen
                deferred.resolve([]);
            }
        };
        // verwerk de bestanden
        process(results);

        return deferred.promise;
    },

    /**
     *
     * @param type
     */
    notifyProgress : function( type ) {
        this.scanned++;

        var percentage = parseInt( (this.scanned / this.files) * 100, 10);
        if (percentage > 0) {
            console.log('[' + type  + '] (' + this.scanned + ' of the ' + this.files + ' ) progress '+ percentage +'%    \r');
        }
    },

    /**
     *
     *
     * @param data
     * @returns {Promise.promise|*}
     */
    gather : function( data ) {
        var deferred = Q.defer(),
            self = this,
            showData = [];

        this.scanned = 0;

        //
        var next = function(data) {
            if( data && data.length > 0) {
                var file = data.pop();
                var options = {
                    title : file.title.replace(/\s/g, '-'),
                    season : file.season,
                    episode: file.episode,
                    location : file.location
                };

                Episode.hasEpisode( options.location, options.season, options.episode)
                    .then( function( found ) {
                        if( !found) {
                            self.getEpisodeInfoFromTrakt( options, function( err, file, result ) {
                                if(err) {
                                    throw err;
                                }
                                showData.push( self.createMediaObject(file, result) );
                                self.notifyProgress('COLLECTING METADATA');

                                var qw = data.length > 0 ? next(data) : deferred.resolve(showData);
                            });
                        } else {
                            var qw = data.length > 0 ? next(data) : deferred.resolve(showData);
                        }
                    });

            }
        };

        next(data);

        return deferred.promise;
    },

    createMediaObject : function(file, result) {
        return {
            show: {
                title: result.show.title,
                summary: result.show.overview,
                image: result.show.images.poster,
                genres: result.show.genres,
                rating: result.show.ratings.percentage
            },
            episode: {
                title: result.episode.title,
                number: result.episode.number,
                season: result.episode.season,
                summary: result.episode.overview,
                image: result.episode.images.screen,
                rating: result.episode.ratings.percentage,
                location : file.location
            }
        };
    },

    /**
     *
     * @param result
     */
    save : function( result ) {
        var self = this,
            deferred = Q.defer();

       if( result.length == 0 ) {
           deferred.resolve();
       }

        var next = function() {
            if( result && result.length > 0 ) {
                var file = result.pop();
                self.saveToDB( file, function() {
                    var check = result.length > 0 ? next() : deferred.resolve();
                });
            }
        };

        next();

        return deferred.promise;
    },

    saveToDB : function( data, callback ) {
        console.log( data.show.title + " - " + data.episode.title );

        Show.get( data.show.title, function(err, result) {
            if(result) {
                Show.addEpisode(result[0], data.episode, callback);
            } else {
                // Maak de tv show aan
                var tvshow = Show.create( {
                    title : data.show.title,
                    summary : data.show.summary,
                    genre : data.show.genres,
                    poster : data.show.image
                }).then( function(tvshow) {
                    console.log( 'show created', tvshow );
                    // tv show is aangemaakt, voeg daar nu de episode aan toe.
                    Show.addEpisode(tvshow, data.episode, callback);
                }, function(err) {
                    console.log("Error: episode info kon niet opgehaald worden voor, ", data.show.title);
                    callback();
                });
            }
        });
    },

    /**
     *
     *
     * @param filename
     * @returns {{title: string, episode: number, season: number}}
     */
    getEpisodeData : function( file, callback ) {
        var episode = 0,
            season  = 0;

        // clean file title
        var episodeInfo = tvTitleCleaner.cleanupTitle( file.filename),
            episodeStripped = episodeInfo.title.replace(/.(avi|mkv|mpeg|mpg|mov|mp4|wmv)$/,"");
            episodeTitle = episodeStripped.trim();

        // extract episode and season from title
        var showTitle             = episodeTitle.replace(/[sS]([0-9]{2})[eE]([0-9]{2})/, ''),
            episodeSeasonMatch    = episodeTitle.match(/[sS]([0-9]{2})/),
            episodeNumberMatch    = episodeTitle.match(/[eE]([0-9]{2})/);

        if( episodeSeasonMatch ){
            season = episodeSeasonMatch[0].replace(/[sS]/,"")
        } else {
            season = '0';
        }

        if(episodeNumberMatch ){
            episode = episodeNumberMatch[0].replace(/[eE]/,"")
        } else {
            episode = '0';
        }

        callback( {
            title   : showTitle.toLowerCase().trim(),
            episode : episode,
            season  : season,
            location : file.location
        } );
    },

    getEpisodeInfoFromTrakt : function(options, callback) {
        var trakt = new Trakt({ username: 'johnGestalt', password: '524f12bb3bb1ae9cbb9dad225186a972abc9771a'});

        trakt.request('show', 'episode/summary', options, function(err, result) {
            if (err) {
                console.log('error retrieving tvshow info', err);
                callback(err, null);
            } else {
                callback(err, options, result );
            }
        });
    }
};