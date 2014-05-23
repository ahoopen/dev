var fs = require('fs');
var path = require('path');
var file = require('./file');

var $file = new file.file();

var folder = function() {
	
};

/**
*
**/
folder.prototype.open = function(dir, cb) {
	var ret = [],
		isDir = false;

	fs.readdir(dir, function(error, files) {
		if(error) throw error;

		files.forEach(function (file) {
			isDir = $file.isDirectory(dir + "/" + file);

			ret.push( {
				path: dir + "/" + file,
				name: file,
				isDir: isDir,
				extensie: path.extname(file)
			});
    	});

    	cb(ret);
	});
};

folder.prototype.update = function() {

};

folder.prototype.create = function() {

};

folder.prototype.delete = function() {

};

exports.folder = folder;