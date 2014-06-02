
// controllers
var home = require('../app/controllers/home'),
	user = require('../app/controllers/Users');

module.exports = function(app) {
	app.get('/', home.index);

	// aanmaken van een account
	//app.get('/signup', user.signup);
	app.get('/signup', function(request, response) {
		response.sendfile( app.get('rootPath') + '/public/index.html');
	});
};