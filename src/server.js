var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    path = require('path');


    var file = require('./file');
    var folder = require('./folder');

var express = require('express');
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

var $folder = new folder.folder();
var $file = new file.file();

//var currentPath = __dirname + "/files";

var currentPath = "/Volumes/Seagate Backup Plus Drive/Series/";
//var defaultPath = __dirname + "/files/";
// zet het begin pad

/**
* Environment variablen
**/
app.set('port', process.env.TEST_PORT || 8888);
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/path', function(request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.writeHead(200);
    response.write( JSON.stringify( $address.set(currentPath) ) );
    response.end();
});

app.post('/goto', function(request, response) {
    var directory = request.body.path;
    currentPath = directory;
    $address.set(directory) 

    $folder.open( directory, function(files) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.writeHead(200);
        response.write( JSON.stringify(files) );
        response.end();
    });
});

app.get('/directory/:dir?', function(req, res){

    var directory = req.param('dir');
    currentPath = path.resolve(currentPath, directory);
    console.log( currentPath );
    $address.set(currentPath);

    $folder.open( currentPath, function(files) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(200);
        res.write( JSON.stringify(files) );
        res.end();
    });
});

app.get('/file/:filename?', function(request, response) {
    var filename = request.param('filename');

        response.setHeader("Access-Control-Allow-Origin", "*");
        response.writeHead(200);
        response.write( JSON.stringify( { path : currentPath + "/" + filename } ) );
        response.end();    
});


app.get('/list', function(request, response) {
    //currentPath = __dirname + "/files/";
    currentPath = "/Volumes/Seagate Backup Plus Drive/Series";

    // __dirname + "/files"
    $folder.open( currentPath, function(files) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.writeHead(200);
        response.write( JSON.stringify(files) );
        response.end();
    });
});

/**
* Geeft de HTML van de afstand bediening terug.
**/
app.get('/remote', function( request, response ) {
    response.sendfile( __dirname + '/public/remote.html', {}, function(err) {
        if(err) throw err;
    });
});

app.get('/', function( request, response ) {
    response.sendfile( __dirname + '/public/index.html');
});

app.get('/grid', function( request, response ) {
  response.sendfile( __dirname + '/public/list.html');
});

//Socket.io Config
io.set('log level', 1);

server.listen(app.get('port'), function(){
  console.log('Npire is running on port ' + app.get('port'));
});

var ss;

//Socket.io Server
io.sockets.on('connection', function (socket) {

 socket.on("screen", function(data){
   socket.type = "screen";
   ss = socket;
   console.log("Screen ready...");
 });
 socket.on("remote", function(data){
   socket.type = "remote";
   console.log("Remote ready...");
 });

 socket.on("controll", function(data){
    console.log(data);
   if(socket.type === "remote"){

     if(data.action === "tap"){
         if(ss != undefined){
            ss.emit("controlling", {action:"enter"});
            }
     }
     else if(data.action === "swipeLeft"){
      if(ss != undefined){
          ss.emit("controlling", {action:"goLeft"});
          }
     }
     else if(data.action === "swipeRight"){
       if(ss != undefined){
           ss.emit("controlling", {action:"goRight"});
           }
     }
   }
 });
});

app.use(function (req, res, next) {
    /*
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
    */
});

//app.listen(8888);



