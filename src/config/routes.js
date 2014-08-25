
// controllers
var show = require('../app/controllers/Show'),
	user = require('../app/controllers/Users'),
	API = require('../app/JSONResponse');

module.exports = function(app) {

	function restrict(req, res, next) {
		if (req.session.user) {
			next();
		} else {
			req.session.error = 'Access denied!';
			res.redirect('/login');
		}
	}	

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

	app.get('/restricted', restrict, function(req, res){
		res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
	});

	app.get('/logout', function(req, res){
	  // destroy the user's session to log them out
	  // will be re-created next request
	  req.session.destroy(function(){
		res.redirect('/');
	  });
	});

	app.get('/login', function(request, response){
		response.sendfile( app.get('rootPath') + '/public/login.html');
	});

	app.post('/login', function(req, res){

	  authenticate(req.body.username, req.body.password, function(err, user){
        var json = new API.JSONResponse();
		
		if(err || !user){
            json.setStatus('error');
            json.setPayload({
                message : "Er is een fout opgetreden."
            });

            res.send(json);
		}
		else{
            req.session.regenerate(function(){
                req.session.user = user;

                json.setStatus('success');
                json.setPayload( {
                    message : "Gebruiker is aangemaakt."
                } );

                res.send(json);
			});
		}
	  });
	});
	
	function authenticate(name, pass, fn) {
		
		if (!module.parent) {
            console.log('authenticating %s:%s', name, pass);
        }
		
		user.get(name, function(result){
			if(result){
				var usr = result;
				var error = null;
				
				if (!usr){
					error = new Error('invalid username');
				}
				else if (usr.password !== pass){
					error = new Error('invalid password');
				}
				
				return fn(error, usr);
			}
		});	
	}


    /***
     *  API show requests
     */

    app.get('/shows', function(request, response) {
        response.sendfile( app.get('rootPath') + '/public/show.html');
    });

    app.get('/episodes', function(request, response) {
        response.sendfile( app.get('rootPath') + '/public/episodes.html');
    });

    app.get('/seasonList', function(request, response) {
        var json = new API.JSONResponse();

        var ret = show.getAllSeasons('Suits')
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