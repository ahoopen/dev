
// controllers
var show = require('../app/controllers/Show'),
	user = require('../app/controllers/Users'),
	API = require('../app/JSONResponse');

module.exports = function(app) {

	app.get('/', function(request, response) {
		response.sendfile( app.get('rootPath') + '/public/angular.html');
	});

	app.get('/api/user/all', function(request, response) {
		user.getAll(function(result){
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

	app.get('/restricted', user.restrict, function(req, res){
        res.sendfile( app.get('rootPath') + '/public/restricted.html');
	});

	app.get('/logout', function(req, res){
	  // destroy the user's session to log them out
	  // will be re-created next request
	  req.session.destroy(function(){
		res.redirect('/');
	  });
	});

	app.get('/login', function(req, res){
		res.sendfile( app.get('rootPath') + '/public/login.html');
	});

	app.post('/login', function(req, res){
        user.authenticate(req.body.username, req.body.password, function(err, user){
            if(err || !user){
                res.status(401).send('Wachtwoord of gebruiker niet correct.');
            }
            else{
                req.session.regenerate(function(){
                    req.session.user = user;
                    res.status(200).send('Wachtwoord en gebruiker correct.');
                });
            }
	  });
	});


    /***
     *  API show requests
     */

    app.get('/shows', function(request, response) {
        response.sendfile( app.get('rootPath') + '/public/show.html');
    });

    app.get('/episodes', function(request, response) {
        response.sendfile( app.get('rootPath') + '/public/episodes.html');
    });

    /**
     *
     */
    app.post('/api/seasons/:title', function(request, response) {
        var title = request.body.title,
            json = new API.JSONResponse();

        var ret = show.getAllSeasons( title )
            .then( function(result) {
                json.setStatus('success');
                json.setPayload(result);
            }, function(err) {
                json.setStatus('failed');
                json.setPayload( {
                    message : 'failed to get season list'
                });
            });

        ret.then( function() {
            response.send( json );
        });
    });

    /**
     *
     */
    app.get('/api/show', function(request, response) {
        var json = new API.JSONResponse();

        var shows = show.getAll()
            .then( function(result) {
                json.setStatus('success');
                json.setPayload( result );
            }, function(err) {
                json.setStatus('failed');
                json.setPayload( {
                    message : "failed to get shows"
                } );
            });

        // wanneer het promise object een status heeft
        // geef dan een json response terug.
        shows.then( function() {
            response.send( json );
        });
    });

    /**
     *
     */
    app.post('/api/show/:id/:season', function(request, response) {
        var title = request.body.title,
            season = parseInt( request.body.season, 10),
            json = new API.JSONResponse();


        var ret = show.getSeason( title, season )
            .then( function( result ) {
                json.setStatus('success');
                json.setPayload( result );
            }, function( errr) {
                json.setStatus('failed');
                json.setPayload( {
                    message : "failed to get show season"
                });
            });

        ret.then( function() {
            response.send( json );
        });
    });

};