var express = require('express');


module.exports = function(app) {
	
	app.configure( function() {
		// configureer express js hier
		app.use( express.bodyParser() );
	});

	// router
	app.use(app.router);
}