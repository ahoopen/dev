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

    server : {
        port : 8080
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
    },

    schedule : {
        // tijd waarop er gekeken wordt of er een update beschikbaar is.
        update : "04:00"
    },

    metadata : {
        folder : "/Users/auketenhoopen/dev/src/data",
        //
        extensions : ['.mkv', '.mp4', '.avi', 'mpeg', 'mov', 'wmv']
    }
};