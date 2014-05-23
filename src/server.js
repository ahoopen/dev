var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    path = require('path');

    var $ = require('jquery');

    var file = require('./file');
    var folder = require('./folder');
    var address = require('./address');

var express = require('express');
var app = express();

var $folder = new folder.folder();
var $file = new file.file();
var $address = new address.address();

var currentPath = __dirname + "/files";
var defaultPath = __dirname + "/files/";
// zet het begin pad
$address.set(currentPath);

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

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

app.get('/', function(request, response) {
    fs.readFile(path.resolve(__dirname,"index.html"), function (err, data) {
        if (err) {
            throw err;
        }
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.writeHead(200);
        response.write( data );
        response.end();
    });   
});

app.get('/list', function(request, response) {
    currentPath = __dirname + "/files/";

    $folder.open( __dirname + "/files", function(files) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.writeHead(200);
        response.write( JSON.stringify(files) );
        response.end();
    });
});



app.use(function (req, res, next) {

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
});

app.listen(8888);


/*
dir.open( __dirname + "/files", function(files) {
    files.forEach( function(file) {
        //console.log( $file.isDirectory(file.path) );
        console.log( file.extensie );
    });
});

//console.log( $file.isDirectory(__dirname + "/files") );

/*
var p = __dirname + "/files";
fs.readdir(p, function (err, files) {
    if (err) {
        throw err;
    }

    files.map(function (file) {
        return path.join(p, file);
    }).filter(function (file) {
        return fs.statSync(file).isFile();
    }).forEach(function (file) {
        console.log("%s (%s)", file, path.extname(file));
    });
});

*/


