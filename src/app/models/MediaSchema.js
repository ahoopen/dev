var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/test');

var LocationSchema = new Schema( {
	path : { type : String, required : true },
	createdAt : { type : Date, default : Date.now }
});

/**
*
**/
var MediaSchema = new Schema( {
	name		: { type : String, trim : true },
	location	: [LocationSchema],
	size		: { type : Number },
	type		: { type : String, enum : ['VIDEO', 'MUSIC', 'IMAGE'] }
});


MediaSchema.pre('save', function(next) {
	var self = this;

	MediaSchema.findOne( { location : this.location }, function(err, result) {
		if( err ) {
			throw err;
		}

		if( !result ) {
			next();
		} else {
			console.log(' bestaat al! ' );
		}
	});
	
});


var Media = mongoose.model("Media", MediaSchema);


var vid1 = new Media( { name : 'dexter s01e01', location: 'series/dexter'} );
var vid2 = new Media( { name : 'dexter s01e01', location: 'series/dexter'} );

vid1.save(function (err, video) {
  if (err) {
  	return console.error(err);
  }
});

vid2.save(function (err, video) {
  if (err) {
  	return console.error(err);
  }
});


Media.find({ 'name' : 'dexter s01e01'}, function(err, result) {
	if(err) {
		throw err;
	}
	
	result.forEach(function(media) {
    	console.log(media.name, media.location);
    });
});
