/*!
 * Module dependencies.
 */

var path = require('path'),
 	rootPath = path.resolve(__dirname + '../..');

/**
 * Expose config
 */

module.exports = {
  development: {
    root: rootPath,
    db: 'mongodb://localhost/test'
  }
};