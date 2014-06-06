
// controllers
var home = require('../app/controllers/home'),
	user = require('../app/controllers/Users'),
	API = require('../app/JSONResponse');

module.exports = function(app) {

	app.get('/', function(request, response) {
		response.sendfile( app.get('rootPath') + '/public/angular.html');
	});

	app.get('/api/users', function(request, response) {
		user.getAll(request.body, function(result){
			var json = new API.JSONResponse();
				
			if(result){
				response.send( result);
			} else {
				json.setStatus('failed');
				json.setPayload( {
					message : "Er konden geen gebruikers gevonden worden."
				} );
				
				response.send( json.getResponse() );
			}
		});	
	});

	/**
	* Api request die vraagt om een specifiek veld te controleren of deze uniek is.
	* Lees, nog niet voorkomt in de database.
	* 
	* @param {Object} express js request datatype
	* @param {Object} express js response datatype
	* @returns {JSON}
	**/
	app.post('/api/user/check/:field', function(request, response) {
		var value = request.body.field;

		user.hasUniqueUsername(value, function(unique) {
			var json = new API.JSONResponse();
			json.setStatus('success');
			json.setPayload( { isUnique : unique });

			response.send( json.getResponse() );
		});
	});

	/**
	* Api request die het aanmaken van een gebruiker afhandelt.
	* Geeft een JSON response terug in een binnen een voorgedefineerd formaat.
	*
	* @param {Object} express js request datatype
	* @param {Object} express js response datatype
	* @returns {JSON}
	**/
	app.post('/api/user/create', function(request, response) {
		user.create(request.body, function(result) {
			var json = new API.JSONResponse();
			if(result) {
				json.setStatus('success');
				json.setPayload( {
					message : "Gebruiker is aangemaakt."
				} );
				response.send( json.getResponse() );
			} else {
				json.setStatus('failed');
				json.setPayload( {
					message : "Gebruiker kon niet aangemaakt worden."
				} );
				response.send( json.getResponse() );
			}
		});
	});

	/**
	* Leidt de gebruiker naar de registratie pagina.
	*
	* @param {Object} express js request datatype
	* @param {Object} express js response datatype
	* @returns {HTML}
	**/
	app.get('/register', function(request, response) {
		response.sendfile( app.get('rootPath') + '/public/register.html');
	});
};