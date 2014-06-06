
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UserSchema = new Schema( {
	username : { type : String, required : true, index : true },
	password : { type : String, required : true },
	email : { type : String, required : true },
	created	 : { type : Date, default : Date.now }
});

/**
* Statics
**/

UserSchema.statics.hasUniqueUsername = function(value, cb) {
	this.find( { username : value }).exec( function( err, result) {
		if(!err && result.length === 0 ) {
			cb(true);
			return;
		}
		cb(false);
	});
};

UserSchema.statics.findAll = function() {
	return this.find().exec();
};

/**
* User name validatie. Kijk of de naam al bestaat.
**/
UserSchema.path('username').validate( function(username, cb) {
	var User = mongoose.model('User');

	// kijk wanneer het een nieuwe gebruiker betreft of wanneer naam veld veranderd is.
	if( this.isNew || this.isModified('username') ) {
		User.find( { username : username } ).exec( function( err, users ) {
			if(!err && users.length === 0 ) {
				cb(true);
			}
			cb(false);
		});		
	} else {
		cb(true);
	}
}, 'Username bestaat al');

/**
* Validatie om te kijken of het wachtwoord veld leeg is
**/
UserSchema.path('password').validate( function(password) {
	return password.length;
}, 'Wachtwoord mag niet leeg zijn');

/**
* Validatie om te kijken of het gebruikernaam veld leeg is
**/
UserSchema.path('username').validate( function(name) {
	return name.length;
}, 'Gebruikersnaam mag niet leeg zijn.');


UserSchema.pre('save', function(next) {
	next();
});

// registreer het model
exports.User = mongoose.model('User', UserSchema);