// mongo <dbname> --eval "db.dropDatabase()"
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    Cache = require('../../cache');

var ObjectId = mongoose.SchemaTypes.ObjectId;

var EpisodeSchema = new Schema( {
	created : { type : Date, default : Date.now },
	title 	: { type : String, required : true, index : true },
	orginalTitle : { type : String, required : false },
	season 	: { type : Number, required : true, index : true },
	number 	: { type : Number, required : true, index : true },
	summary : { type : String },
	screen	: { type : String },
    location : { type : String }
});

EpisodeSchema.statics.hasEpisode = function(location, season, number) {
	var promise = new mongoose.Promise;

	this.find( { location : location, season : season, number : number } )
	 .exec( function(err, result) {
	 	if(err) {
	 		promise.error( err );
	 	}
	 	var ret = (result.length !== 0) ? promise.complete(true) : promise.complete(false);
	 });

	 return promise;
};

exports.Episode  = mongoose.model('Episode', EpisodeSchema);

var ShowSchema = new Schema( {
	title	: { type : String, required : true, index : true },
	summary	: { type : String },
	genre	: { type : Array },
	poster	: { type : String },
	episodes: [{ type : ObjectId, ref: "Episode", index : true } ]
});

/**
*
**/
ShowSchema.statics.get = function(tvshow, callback) {
	this.find( { title : tvshow }).exec( function( err, show ) {
		if(err) {
			callback(err, null);
		}
		if(!err && show.length !== 0 ) {
			// show is gevonden
			callback(null, show);
		} else {
			// show is niet gevonden.
			callback(null, null);
		}
	});
};

/**
* Geeft een tv show terug met daarbij alle afleveringen
* 
* @param {String} title De titel van de tvshow
* @returns {Object} geeft een tvshow object terug
**/
ShowSchema.statics.getShow = function(title) {
	var promise = new mongoose.Promise;

	this.findOne( { title : title })
	 .populate('episodes')
	 .exec( function(err, result) {
		if(err) {
			promise.error( err );
		}

		var episodes = result.episodes.sort( function(a, b) {
            if( a.number < b.number ) {
                return -1;
            } else if( a.number > b.number) {
                return 1;
            }
            return 0;
        });

        promise.complete( {
        	title : result.title,
        	summary : result.summary,
        	episodes : episodes,
            genres : result.genre
        } );
	 });

	return promise;
};

/**
* Geeft alle tv shows terug. 
* 
* @returns {Object} geeft een tvshow object terug
**/
ShowSchema.statics.getAllShows = function() {
	var promise = new mongoose.Promise;

	this.find()
	 .select('title summary genre poster')
	 .exec( function(err, result) {
	 	if(err) {
	 		promise.error( err );
	 	}

	 	var shows = result.sort( function(a, b) {
            if( a.title < b.title ) {
                return -1;
            } else if( a.title > b.title) {
                return 1;
            }
            return 0;
        });

        promise.complete( shows );
	 });

	return promise;
};

/**
 * Geeft terug hoeveel seizoenen er zijn van de desbetreffende serie.
 *
 * @param title
 * @returns {mongoose.Promise}
 */
ShowSchema.statics.getAvailableSeasons = function( title ) {
    var promise = new mongoose.Promise,
        seasons = [];

    this.findOne( { title : title } )
        .populate('episodes')
        .exec( function(err, result) {
            if(err) {
                promise.error( err );
            }

            if( result !== null && typeof result.episodes !== 'undefined' ) {
                result.episodes.filter( function(episode) {
                    if( seasons.indexOf( episode.season ) === -1 ) {
                        seasons.push( episode.season );
                    }
                });

                promise.complete( {
                    seasons    : seasons.length
                } );
            }

            // geen data gevonden
            promise.error(null);
        });

    return promise;
};

/**
* Geeft een tv show terug met daarbij alle afleveringen gefilterd op het seizoens nummer.
* 
* @param {String} title De titel van de tvshow
* @param {Number} season het seizoens nummer.
* @returns {Object} geeft een tvshow object terug
**/
ShowSchema.statics.getSeason = function( title, season) {
   var promise = new mongoose.Promise;

   // 
   this.findOne( { title : title } )
    .populate('episodes')
    .exec( function(err, result) {
        if(err) {
            promise.error( err );
        }

        if( result !== null && typeof result.episodes !== 'undefined' ) {
            // filter de episodes op het seizoen
            var episodes = result.episodes.filter(function (episode) {
                if (episode.season === season) {
                    return episode;
                }
            }).sort(function (a, b) {
                if (a.number < b.number) {
                    return -1;
                } else if (a.number > b.number) {
                    return 1;
                }
                return 0;
            });

            promise.complete( {
                title    : result.title,
                summary  : result.summary,
                episodes : episodes
            } );
        }

        // geen data gevonden
        promise.error(null);
    });

    return promise;
};

/**
*
**/
ShowSchema.statics.addEpisode = function(show, episode, callback) {
	var Episode = mongoose.model('Episode');

    var ep = new Episode( {
        title : episode.title,
        season : episode.season,
        number : episode.number,
        summary : episode.summary,
        screen : episode.image,
        location : episode.location
    });
    ep.save( function(err) {
        if(err) {
            throw err;
        }
        show.episodes.push( { '_id' : ep._id } );
        show.save( function(err) {
            if(err) {
                throw err;
            }
            callback();
        });
    });
};


/**
* Voordat een aflevering wordt opgeslagen, wordt er gekeken of deze al bestaat.
* Indien dat zo is, sla hem dan niet op. 
*
**/
EpisodeSchema.pre('save', function(next, done) {
	var self = this;
	var Episode = mongoose.model('Episode');

	// bestaat de episode al in de database?
	Episode.find( { title : self.title, number : self.number, season : self.season, location : self.location })
		.exec( function(err, result) {
			if(!result.length) {
				// nieuwe record ga door met opslaan
				next();
			} else {
				console.log( "SAVE: bestaat al!");
				done();
                //next();
			}
		});
});



exports.Show  = mongoose.model('Show', ShowSchema);