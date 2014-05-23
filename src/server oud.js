var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    path = require('path');

    var $ = require('jquery');

    var file = require('./file');
    var folder = require('./folder');


var dir = new folder.folder();
var $file = new file.file();
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

/*

fs.readdir(__dirname + '/files', function (err, files) { // '/' denotes the root folder
  if (err) throw err;

   files.forEach( function (file) {
     fs.lstat('/'+file, function(err, stats) {
       if (!err && stats.isDirectory()) { //conditing for identifying folders
         $('ul#foldertree').append('<li class="folder">'+file+'</li>');
       }
       else{
        $('ul#foldertree').append('<li class="file">'+file+'</li>');
      }
     });
   });

});


// load the video files and the index html page
fs.readFile(path.resolve(__dirname,"movie.webm"), function (err, data) {
    if (err) {
        throw err;
    }
    movie_webm = data;
});
fs.readFile(path.resolve(__dirname,"test.mp4"), function (err, data) {
    if (err) {
        throw err;
    }
    movie_mp4 = data;
});
fs.readFile(path.resolve(__dirname,"movie.ogg"), function (err, data) {
    if (err) {
        throw err;
    }
    movie_ogg = data;
});

fs.readFile(path.resolve(__dirname,"index.html"), function (err, data) {
    if (err) {
        throw err;
    }
    indexPage = data;    
});

*/
// create http server
http.createServer(function (req, res) {
    
    var reqResource = url.parse(req.url).pathname;

    //console.log("Resource: " + reqResource);

    if(reqResource == "/list"){
        dir.open( __dirname + "/files", function(files) {
            
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.writeHead(200);
            res.write( JSON.stringify(files) );
            res.end();
        });
    } 

}).listen(8888); 

