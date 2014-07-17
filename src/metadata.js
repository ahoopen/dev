var Trakt = require('trakt'),
    path = require('path'),
    fs = require('fs'),
    async = require('async');

    require('./app/models/ShowSchema');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');


 var Episode = mongoose.model('Episode');

 var Show = mongoose.model('Show');

var totalFiles = 0,
    nrScanned = 0;
var start = new Date();

/**
*
*
**/
var getFiles = function(dir, extensions, callback) {
  
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
          getFiles(filePath, extensions, function(err, results) {
            if (err) {
              return next(err);
            }

            returnFiles = returnFiles.concat(results);
            next();
          });
        // is het een bestand?
        } else if ( stat.isFile() ) {
          // doorloop de extensie array
          extensions.forEach( function( extension ) {
            // bestand komt overeen met file extensie.
            if ( file.indexOf(extension, file.length - extension.length) !== -1 ) {
              returnFiles.push( { filename: file, location: filePath } );
            }
          });

          next();
        }
      });
    // error callback
    }, function(err) {
      callback(err, returnFiles);
    });
  });
};

var getMetadataFromTrakt = function(tvShow, callback) {
    var options = { query: tvShow, limit : 1 },
        trakt = new Trakt({ username: 'johnGestalt', password: '524f12bb3bb1ae9cbb9dad225186a972abc9771a'});
   
    trakt.request('search', 'shows', options, function(err, result) {
        if (err) {
            console.log('error retrieving tvshow info', err);
            callback(err, null);
        } else {
            var tvSearchResult = result[0];

            if (tvSearchResult !== undefined && tvSearchResult !== '' && tvSearchResult !== null) {
                callback(err, tvSearchResult);
            }
        }
    });
};


var getEpisodeInfoFromTrakt = function(options, callback) {
    var trakt = new Trakt({ username: 'johnGestalt', password: '524f12bb3bb1ae9cbb9dad225186a972abc9771a'});
   
    trakt.request('show', 'episode/summary', options, function(err, result) {
        if (err) {
            console.log('error retrieving tvshow info', err);
            callback(err, null);
        } else {
            var tvSearchResult = result;

            callback(err, tvSearchResult );
        }
    });
};



var metadata = function() {

};

metadata.prototype = {

    parse : function(results) {
        if(!results) {
            // geen results
        }
        var self = this;

        console.log('parse results!');

        if( results && results.length > 0 ) {
            var file = results.pop();
            this.doParse(file.filename, function() {
                self.parse(results);
            });
        }
    },

    doParse : function(file, callback) {
        var originalTitle           = file.split('/').pop(),
            episodeReturnedTitle    = this.getCleanTitle(originalTitle),
            episodeStripped         = episodeReturnedTitle.replace(/.(avi|mkv|mpeg|mpg|mov|mp4|wmv)$/,""),
            episodeTitle            = episodeStripped.trimRight();

        this.getEpisodeInfo(episodeTitle, callback);

        nrScanned++;

        var perc = parseInt((nrScanned / totalFiles),10) * 100;
        var increment = new Date(), difference = increment - start;
        if (perc > 0) {
            var total = (difference / perc) * 100, eta = total - difference;
            console.log('Item '+nrScanned+' from '+totalFiles+', '+perc+'% done \r');
        }

        if(perc === 100) {
        
        }         
    },

    /**
    *
    **/
    getEpisodeInfo : function(episodeTitle, callback) {
        var episodeSeason = '',
            season = '',
            number = '',
            title = '',
            trimmedTitle = '',
            episodeNumber = '';

        var showTitle    = episodeTitle.replace(/[sS]([0-9]{2})[eE]([0-9]{2})/, ''),
            episodeSeasonMatch = episodeTitle.match(/[sS]([0-9]{2})/),
            episodeNumberMatch = episodeTitle.match(/[eE]([0-9]{2})/);

        if( episodeSeasonMatch ){
            episodeSeason = episodeSeasonMatch[0].replace(/[sS]/,"");
        }
        if(episodeNumberMatch ){
            episodeNumber = episodeNumberMatch[0].replace(/[eE]/,"");
        }

        var episodeData = {
            "showTitle" : showTitle.toLowerCase(),
            "episodeSeason" : episodeSeason,
            "episodeNumber" : episodeNumber
        };

        season          = episodeData.episodeSeason;
        number          = episodeData.episodeNumber;
        title           = episodeData.showTitle.trim();
        trimmedTitle    = title.replace(/\s/g, '-');     

        var self = this;

        console.log( showTitle);

        Episode.hasEpisode(trimmedTitle, season, number).then(function(found) {
            if(!found) {
                // zoek eerst uit met welke tv show we te maken hebben
                var test = self.getCleanTitle(trimmedTitle).substring(0,18);
                console.log("cleaned: ",test);
                self.getMetaDataForShow( test, function(response) {
                    var opt = {
                        title : response[0].replace(/\s/g, '-').substring(0,23),
                        season : episodeSeason,
                        episode: episodeNumber
                    };

                    console.log("Options: ",opt);

                    getEpisodeInfoFromTrakt(opt, function(err, data){
                        if(err) {
                            throw err;
                        }

                        Show.get( data.show.title, function(err, result) {
                            console.log("tv show: ", data.show.title);
                            if(result) {
                                Show.addEpisode(result[0], trimmedTitle, data.episode, callback);
                            } else {
                                console.log(  data.images );
                                // Maak de tv show aan
                                Show.create( {
                                    title : data.show.title,
                                    summary : data.show.overview,
                                    genre : data.show.genres,
                                    poster : data.show.images.poster
                                }).then( function(tvshow) {
                                    console.log( 'show created' );
                                    // tv show is aangemaakt, voeg daar nu de episode aan toe.
                                    Show.addEpisode(tvshow, data.episode, callback);
                                }, function(err) {
                                    console.log("Error: episode info kon niet opgehaald worden voor, ", data.show.title);
                                    callback();
                                });
                            }
                        });
                        
                    });            
                });
            } else {
                callback();
            }
        }, function(err) {
            console.log('Episode check failed');
        });        
    },

    getMetaDataForShow : function( tvTitle, callback) {
        var genre   = "",
            certification = "",
            showTitle = "",
            bannerImage = "";

            getMetadataFromTrakt(tvTitle, function(err, result){
                if (err) {
                    throw err;
                } else {
                    var traktResult = result
                        ,showTitleResult;

                    bannerImage = traktResult.images.banner;
                    showTitle = traktResult.title;

                    if(traktResult !== null){
                        if(traktResult.genres !== undefined){
                            genre = traktResult.genres;
                        }
                        if (traktResult.certification !== undefined) {
                            certification = traktResult.certification;
                        }
                        if(traktResult.title !== undefined){
                            showTitleResult = traktResult.title;
                        }
                    }

                    showTitle = showTitleResult.toLowerCase();
                    var showMetaData = [showTitle, bannerImage, genre, certification];
                    callback(showMetaData);
                }
            });          
    },

    getMetaDataForEpisode : function() {

    },

    getCleanTitle : function(title) {
        var cleanTitle = title;
        cleanTitle = this.stripIllegalCharacters(cleanTitle, ' ');
        cleanTitle = this.removeYearFromTitle(cleanTitle);
        cleanTitle = this.removeReleaseGroupNamesFromTitle(cleanTitle);
        cleanTitle = this.removeMovieTypeFromTitle(cleanTitle);
        cleanTitle = this.removeAudioTypesFromTitle(cleanTitle);
        cleanTitle = this.removeCountryNamesFromTitle(cleanTitle);

        return cleanTitle;
    },

    stripIllegalCharacters : function(movieTitle, replacementString) {
        return movieTitle.replace(/\.|\,|\'|_|\/|\+|\-/g, replacementString);
    },

    removeYearFromTitle : function(movieTitle) {
        var YEAR_REGEX = /(19[012356789]\d)|20[012346789]\d|\[|\]/g;
        return movieTitle.replace(YEAR_REGEX, "").replace(/\(|\)/g,'');
    },

    removeReleaseGroupNamesFromTitle : function(movieTitle) {
        return movieTitle.replace(
            /FxM|aAF|DD5|arc|AAC|XviD AFG|BLiND|MLR|AFO|TBFA|WEB DL|264 TB|WB|ARAXIAL|UNiVERSAL|ToZoon|PFa|SiRiUS|Rets|BestDivX|DIMENSION|CTU|ORENJI|LOL|juggs|NeDiVx|ESPiSE|MiLLENiUM|iMMORTALS|QiM|QuidaM|COCAiN|DOMiNO|JBW|LRC|WPi|NTi|SiNK|HLS|HNR|iKA|LPD|DMT|DvF|IMBT|LMG|DiAMOND|DoNE|D0PE|NEPTUNE|TC|SAPHiRE|PUKKA|FiCO|PAL|aXXo|VoMiT|ViTE|ALLiANCE|mVs|XanaX|FLAiTE|PREVAiL|CAMERA|VH-PROD|BrG|replica|FZERO/g,
            "");
    },

    removeMovieTypeFromTitle : function(movieTitle) {
        return movieTitle.replace(
            /dvdrip|multi9|xxx|HDDVD|H264|x264 DON|264 KiNGS|x264|AC3|web|hdtv|vhs|embeded|embedded|ac3|dd5 1|m sub|x264|dvd5|dvd9|multi sub|non|h264|x264| sub|subs|ntsc|ingebakken|torrent|torrentz|bluray|brrip|sample|xvid|cam|camrip|wp|workprint|telecine|ppv|ppvrip|scr|screener|dvdscr|bdscr|ddc|R5|telesync|pdvd|1080p|BDRIP|hq|sd|720p|hdrip/gi,
            "");
    },

    removeAudioTypesFromTitle : function(movieTitle) {
        return movieTitle.replace(
            /320kbps|192kbps|128kbps|mp3|320|192|128/gi,
            "");
    },

    removeCountryNamesFromTitle : function(movieTitle) {
        return movieTitle.replace(
            /NL|SWE|SWESUB|ENG|JAP|BRAZIL|TURKIC|slavic|SLK|ITA|HEBREW|HEB|ESP|RUS|DE|german|french|FR|ESPA|dansk|HUN/g,
            "");
    }

};





     Show.getAllShows().then( function(data) {
         console.log( data );

         Show.getSeason('Suits', 1).then( function(data) {
            console.log( data );
         });

     });




/*
exports.metadata = getFiles('/Volumes/Seagate Backup Plus Drive/Series/Suits/', ['.mkv', '.mp4', '.avi'], function(err, files) {
  totalFiles = (files) ? files.length : 0;
  
  console.log("Start met het indexeren van ", totalFiles, " bestanden.");
  var meta = new metadata();
  meta.parse(files);





});

*/

