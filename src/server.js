var express = require('express'),
	fs  = require('fs');

// laad configuraties
var env = process.env.NODE_ENV || 'development',
	config = require('./config/config'),
	mongoose = require('mongoose');

var connect = function() {
	var options = { server : { socketOptions: { keepAlive : 1 } } };
	mongoose.connect( config.development.db, options );
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

app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

// applicatie settings
require('./config/express')(app);

app.use(express.static(__dirname + '/public') );


// boorstrap routes
require('./config/routes')(app);

var server = app.listen( config.server.port );
var io = require('socket.io').listen(server);

console.log('Server draait op poort ' +  config.server.port );
app.set('rootPath', __dirname);

exports = module.exports = app;

io.sockets.on('connection', function ( socket ) {

   var i = 0;
   setInterval( function() {
       socket.emit("download", i++);
   }, 200);


});
