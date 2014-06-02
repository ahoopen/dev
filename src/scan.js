var fs = require('fs');
var async = require('async');

/**
*
*
**/
var scan = function(dir, extensions, callback) {
  
  fs.readdir(dir, function(err, files) {
    var returnFiles = [];
    
    async.each(files, function(file, next) {
      var filePath = dir + '/' + file;

      fs.stat(filePath, function(err, stat) {
        // fout gevonden
        if (err) {
          return next(err);
        }

        // is het een directory?
        if ( stat.isDirectory() ) {
          // scan deze directory ook
          scan(filePath, extensions, function(err, results) {
            if (err) {
              return next(err);
            }

            returnFiles = returnFiles.concat(results);
            next();
          });
        // is het een bestand?
        } else if ( stat.isFile() ) {
          // doorloop de extensie array
          extensions.forEach( function( extension ) {
            // bestand komt overeen met file extensie.
            if ( file.indexOf(extension, file.length - extension.length) !== -1 ) {
              returnFiles.push( { filename: file, location: filePath } );
            }
          });

          next();
        }
      });
    // error callback
    }, function(err) {
      callback(err, returnFiles);
    });
  });
};


scan(__dirname + '/files', ['.txt', '.mp4'], function(err, files) {
  // Do something with files that ends in '.ext'.
  console.log(files);
});