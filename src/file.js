var fs = require('fs');
var path = require('path');

var file = function() {

};

file.prototype.isDirectory = function(path) {
	var fileInfo = fs.statSync(path);

	try {
		return fileInfo.isDirectory();
	} catch(e) {
		throw e;
	}
};

file.prototype.isFile = function() {
	var fileInfo = fs.statSync(path);

	try {
		return fileInfo.isFile();
	} catch(e) {
		throw e;
	}
};

/**
* 
**/
file.prototype.exists = function(p) {
	return fs.existsSync(p);
};

file.prototype.getType = function() {

};

exports.file = file;