var express = require('express');
var path = require('path');

module.exports = function(app) {
	
	app.configure( function() {

		//app.use(logger());
		// configureer express js hier
		app.use( express.bodyParser() );
		

		function logErrors(err, req, res, next) {
			console.error(err.stack);
			next(err);
		}

		app.use(logErrors);

	});

	// router
	app.use(app.router);
};