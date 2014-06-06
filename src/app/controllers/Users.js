var mongoose = require('mongoose'),
	User = mongoose.model('User');

exports.signup = function(request, response) {
	response.sendfile( app.get('rootPath') + '/public/index.html');
};

/**
* creates a new user.
**/
exports.create = function(data, callback) {
	
	var user = new User( { 
		username : data.username, 
		password : data.password,
		email : data.email
	} );

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

/**
* Gets all users.
**/
exports.getAll = function(data, callback) {
	
	User.find(function (err, users) {
		if (err) {
			throw err;
		} else {
			var userDetails = users.map(function(u){
				return {name: u.username, email: u.email};
			});
			
			callback(userDetails);
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
