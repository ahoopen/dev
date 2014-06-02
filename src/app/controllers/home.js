var mongoose = require('mongoose'),
	User = mongoose.model('User');


exports.index = function(request, response) {
	
	var usr = new User( { username : 'ahoopen2', password : '123456' } );

	usr.save( function(err, result) {
		if(err) {
			console.log( "error saving..!", err);
			for( var errName in err.errors ) {
				console.log( err.errors[errName].type);
			}
		}

	});

	User.find( { username : 'ahoopen' }, function(err, user) {
		console.log(user);
	});

	response.writeHead(200);
	response.write( "dit is een test" );
	response.end();
}