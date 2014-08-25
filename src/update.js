var fs = require('fs-extra'),
    Q = require('q'),
    wget = require('wget'),
    AdmZip = require("adm-zip"),
    config = require('./config/config');

/**
 * Update zorgt ervoor dat de update gedownload word, unzipped en geinstalleerd.
 * Na de installatie, worden alle dependencies geinstalleerd. (bower en node)
 *
 * @type {{prepare: prepare, download: download, unzip: unzip, install: install, nodeInstall: nodeInstall, bowerInstall: bowerInstall, clean: clean}}
 */
exports.update = {

    /**
     * Voert de update in stappen uit. Het downloaden, uitpakken en het installeren.
     */
    run : function( callback ) {
        var update = this;

        update.download( config.update.location )
            .then( function( data ) {
                console.log("[UPDATE]: unzipping update..");
                return update.unzip(data);
            })
            .then( function() {
                console.log("[UPDATE]: starting installation..");
                return update.install();
            })
            .then( function() {
                console.log("[UPDATE]: update complete!");
                callback();
            })
            .progress( function( progress ) {
                console.log( progress );
            });
    },

    /**
     *  Zorgt ervoor dat de 'install' map bestaat zodat de update gedownload
     *  kan worden.
     */
    prepare : function() {
      // zorg ervoor dat de install directory beschikbaar is.
        fs.ensureDir( config.update.folder, function(err) {
            if(err) {
                throw err;
            }
        });
    },

    /**
     * Download de update. Wanneer de download klaar is wordt de zip
     * uitgepakt in de folder.
     *
     * @param url
     * @returns {Promise.promise|*}
     */
    download : function( url ) {
        console.log("Update aan het downloaden.");

        var deferred = Q.defer();

        // bereid de update voor.
        this.prepare();

        var download = wget.download(url, config.update.output);
        download.on('error', function(err) {
           deferred.reject(err);
        });
        download.on('end', function(output) {
            deferred.resolve(output);
        });
        download.on('progress', function(progress) {
            deferred.notify( Math.round( progress * 100 ) );
        });

        return deferred.promise;
    },

    /**
     * Pakt het zip bestand uit in de installatie folder.
     *
     * @param output
     */
    unzip : function(output) {
        var zip = new AdmZip(output),
            deferred = Q.defer();

        zip.extractAllTo( config.update.folder, true);

        setTimeout( function() {
            deferred.resolve();
        }, 2500 );

        return deferred.promise;
    },

    /**
     * Kopieert de uitgepakte update en overschrijft de huidige versie.
     * Daarna wordt er een npm install uitgevoerd om eventuele nieuwe node packages te
     * downloaden.
     *
     */
    install : function() {
        var self = this,
            deferred = Q.defer();

        fs.copy('./install/dev-master', config.update.target, function(err) {
           if(err) {
               throw err;
           } else {
               // clean
               self.clean( config.update.folder );

               Q.all( [
                   self.nodeInstall(),
                   self.bowerInstall()
               ]).then( function() {
                   deferred.resolve(true);
               }, function(err) {
                   // installatie bevat fouten
                   deferred.reject(err);
               });
            }
        });

        return deferred.promise;
    },

    /**
     * installeer alle node dependencies
     *
     * @returns {Promise.promise|*}
     */
    nodeInstall : function() {
        var deferred = Q.defer();

        // install dependencies
        var exec = require('child_process').exec,
            child = exec('npm install', { maxBuffer: 9000*1024 }, function(err, stdout, stderror) {
                if (err) {
                    console.log('fout bij installeren dependencies: ',err) ;
                    deferred.reject(false);
                }
            });

        child.on('exit', function() {
            // Klaar met installeren node dependencies
            deferred.resolve(true);
        });

        return deferred.promise;
    },

    /**
     * Installeer alle Bower dependencies
     *
     * @returns {Promise.promise|*}
     */
    bowerInstall : function() {
        var deferred = Q.defer();
        var process = require('child_process');

        process.spawn('bower', ['install'],{ cwd: config.update.target }).on('close', function(data) {
            // klaar met installeren bower dependencies.
            deferred.resolve(true);
        });

        return deferred.promise;
    },

    /**
     *
     * @param dir
     */
    clean : function( dir ) {
        var prune = require('rimraf');
        prune( dir, function(err) {
            if( err) {
                // fout bij het schoonmaken van de installatie folder.
                throw err;
            }
        });
    }
};