
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var EpisodeSchema = new Schema( {
	title	: { type : String, required : true },
	number	: { type : Number, required : true },
	season	: { type : Number, required : true, index : true },
	summary : { type : String },
	image	: { type : String },
	show 	: {
		title	: { type : String, required : true, index : true },
		genre	: { type : Array },
		summary : { type : String },
		poster	: { type : String }		
	}
});


EpisodeSchema.statics.findShow = function(show, callback) {
	this.find( { 'show.title' : show }, function(err, results) {
	    if(err) {
	        throw err;
	    }
	    callback(null, results);
	});
};

/**
* 
*
**/
EpisodeSchema.statics.getSeasons = function( tvshow, callback) {
	this.aggregate(
	    { 
	        $match: { 'show.title' : tvshow  }
	    },
	    { 
	    	$group: { _id: '$season', total_episodes: { $sum: 1 } } 
	    },
	    function (err, result) {
	        if (err) {
	        	throw err;
	        }
	        callback(null,result);
	    }
	);	
};


/**
* Geeft alle tv shows terug die er in de database zitten.
*
**/
EpisodeSchema.statics.getAllShows = function(callback) {
	this.aggregate( {
			$group : { _id : '$show.title' }	
		}, function(err, result) {
			if(err) {
				throw err;
			}
			callback(null,result);
		}
	);
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
	Episode.find( { title : self.title })
		.where("show.title", self.show.title)
		.exec( function(err, result) {
			if(!result.length) {
				// nieuwe record ga door met opslaan
				next();
			} else {
				console.log( "bestaat al!");
				done();
			}
		});
});

exports.Episode  = mongoose.model('Episode', EpisodeSchema);