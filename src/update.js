var child_process = require('child_process'),
    fs = require('fs-extra'),
    Q = require('q'),
    wget = require('wget'),
    AdmZip = require("adm-zip"),
    config = require('./config/config');


var update = function() {

};

update.prototype =  {

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

        var deferred = Q.defer(),
            self = this;

        // bereid de update voor.
        this.prepare();

        var download = wget.download(url, config.update.output);
        download.on('error', function(err) {
           deferred.reject(err);
        });
        download.on('end', function(output) {
            setTimeout( function() {
                self.unzip( output );
            }, 2500 );
            deferred.resolve(output);
        });
        download.on('progress', function(progress) {
            deferred.notify( Math.round( progress * 100 ) );
        });

        return deferred.promise;
    },

    /**
     *
     * @param output
     */
    unzip : function(output) {
        console.log("Unzipping nieuwe versie");

        var zip = new AdmZip(output);
        zip.extractAllTo( config.update.folder, true);

        var self = this;
        setTimeout( function() {
            self.install();
        }, 1000 );
    },

    /**
     * Kopieert de uitgepakte update en overschrijft de huidige versie.
     * Daarna wordt er een npm install uitgevoerd om eventuele nieuwe node packages te
     * downloaden.
     *
     */
    install : function() {
        var self = this;

        fs.copy('./install/dev-master', config.update.target, function(err) {
           if(err) {
               throw err;
           } else {
               console.log('update succesvol');
               // clean
               self.clean( config.update.folder );

               Q.all( [
                   self.nodeInstall(),
                   self.bowerInstall()
               ]).then( function() {
                    console.log('update is klaar met installeren!');
               }, function(err) {
                   // installatie bevat fouten
               });
            }
        });
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
            console.log('Klaar met installeren node dependencies');
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
            console.log('bower install complete');
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


var u = new update();
u.download( config.update.location )
    .progress( function( progress ) {
        console.log( progress );
    });
