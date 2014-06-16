var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	express = require('express');

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
* Logs a user in.
**/
exports.login = function(data, callback) {
	
	console.log("login executed!");
};

/**
* Gets all users.
**/
exports.getAll = function(callback) {
	
	User.find(function (err, users) {
		if (err) {
			throw err;
		} else {
			var userDetails = users.map(function(u){
				return {name: u.username, email: u.email, password: u.password};
			});
			
			callback(userDetails);
		}
	});
};


/**
 * Gets one user by name.
 **/
exports.get = function(username, callback) {

    User.findOne({username: username},function (err, user) {
        if (err) {
            throw err;
        } else {
            callback( {name: user.username, email: user.email, password: user.password} );
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
