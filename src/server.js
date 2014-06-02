var express = require('express'),
	fs  = require('fs');

// laad configuraties
var env = process.env.NODE_ENV || 'development',
	config = require('./config/config')[env],
	mongoose = require('mongoose');

var connect = function() {
	var options = { server : { socketOptions: { keepAlive : 1 } } };
	mongoose.connect( config.db, options );
};
connect();

// error handling
mongoose.connection.on('error', function(err) {
	console.log("error mongoose : ", err);
});

mongoose.connection.on('disconnected', function() {
	connect();
});

// bootstrap de modellen
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach( function(file) {
	if (~file.indexOf('.js')) {
		require(models_path + '/' + file);
	}
});

var app = express();

// applicatie settings
require('./config/express')(app);

app.use(express.static(__dirname + '/public') ); 

// boorstrap routes
require('./config/routes')(app);

var port = process.env.PORT || 8080;
app.listen(port);

console.log('Server draait op poort ' + port);
app.set('rootPath', __dirname);

exports = module.exports = app;