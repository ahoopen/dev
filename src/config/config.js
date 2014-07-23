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
    },

    version : {
        file : "https://raw.github.com/ahoopen/dev/master/package.json"
    },

    /**
     * Configuratie voor het ophalen en installeren van updates
     */
    update : {
        location : "https://codeload.github.com/ahoopen/dev/zip/master",
        // de locatie waar de update naar toe gedownload word
        folder : "./install",
        // bestand waar de update naar toegeschreven word.
        output : "./install/update.zip",
        // de locatie waar de update geinstalleerd word.
        target : "./../"
    }
};