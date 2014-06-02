
// controllers
var home = require('../app/controllers/home'),
	user = require('../app/controllers/Users');

module.exports = function(app) {

	app.get('/', function(request, response) {
		response.sendfile( app.get('rootPath') + '/public/angular.html');
	});

	app.get('/api/users', function(request, response) {
		response.send([ { text : 'user 1' }, { text : 'user 2' } , { text : 'user 3' } ]);
	});

	// aanmaken van een account
	app.get('/register', function(request, response) {
		response.sendfile( app.get('rootPath') + '/public/register.html');
	});
};