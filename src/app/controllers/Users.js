var mongoose = require('mongoose'),
	User = mongoose.model('User');

exports.signup = function(request, response) {
	response.sendfile( app.get('rootPath') + '/public/index.html');
};

/**
*
**/
exports.create = function(data, callback) {
	
	var user = new User( { 
		username : data.username, 
		password : data.password 
	} );

	console.log("voor het opslaan van de gebruiker");

	user.save( function(err) {
		if(err) {
			throw err;
			//hasValidationErrors(err);
			//callback(err);
		} else {
			console.log("gebruiker is opgeslagen!");
			callback(true);
		}
	});
};

function hasValidationErrors(err) {
	console.log('err', err);
	if (err.name === 'ValidationError') {
		for (var field in err.errors) {
			console.log(field);
		}
	}
}

exports.hasUniqueUsername = function(value, cb) {
	User.hasUniqueUsername(value, cb);
};

exports.findAll = function() {
	return User.findAll();
};