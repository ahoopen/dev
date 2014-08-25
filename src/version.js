var fs = require('fs'),
    request = require('request'),
    Q = require('q'),
    config = require('./config/config');


exports.version = {

    /**
     * Haal de project configuratie op.
     *
     * @returns {Promise.promise|*}
     */
    get : function() {
        var url = config.version.file,
            deferred = Q.defer();

        request( {
            url : url,
            headers : { "Accept" : "application/json" },
            method : "GET"
        }, function( err, response, body) {
            if(err) {
                deferred.reject(err);
            }
            deferred.resolve(body);
        });

        return deferred.promise;
    },

    /**
     * Check of er een update beschikbaar is.
     *
     * @returns {Promise.promise|*}
     */
    check : function() {
        var deferred = Q.defer();

        this.get().then( function( response ) {
            var current = JSON.parse( fs.readFileSync('./../package.json')),
                remote = JSON.parse(response);

            if( remote.version > current.version ) {
                // nieuwe versie beschikbaar
                deferred.resolve(true);
            } else {
                // huidige versie is up to date
                deferred.resolve(false);
            }
        }, function(err) {
            // connectie probleem
            deferred.reject(err);
        });

        return deferred.promise;
    }
};