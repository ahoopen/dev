var events = require("events");
var path = require('path');
var util = require("util");

var address = function( element ) {
	this.element = element;
};

/**
*
**/
address.prototype.set = function(dir_path) {
	this.current_path = path.normalize(dir_path);

	// Split path into separate elements
	var sequence = this.current_path.split(path.sep);
	var result = [];

	var i = 0;
	for (; i < sequence.length; ++i) {
		result.push({
		  name: sequence[i],
		  path: sequence.slice(0, 1 + i).join(path.sep),
		});
	}

	// Add root for *nix
	if (sequence[0] == '' && process.platform != 'win32') {
		result[0] = {
		  name: 'root',
		  path: '/',
		};
	}

	return result = result.splice(6, result.length);
};

address.prototype.enter = function() {

};

address.prototype.navigation = function(breadcrumbs) {
	var nav;
	breadcrumbs = breadcrumbs.splice(5, breadcrumbs.length);

	breadcrumbs.forEach( function(breadcrumb) {
		nav += "<li data-path='" + breadcrumb.path + "'>" + breadcrumb.name + "</li>";
	});

	return nav;
};

exports.address = address;
