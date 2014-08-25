var scheduler = require('./schedule').schedule,
    update = require('./update').update,
    version = require('./version').version,
    metadata = require('./app/util/metadata').metadata,
    config = require('./config/config');

var workflow = function() {

};

workflow.prototype = {

    run : function(workflow) {

    },

    /**
     * Update workflow kijkt of er een nieuwe versie beschikbaar is.
     * Indien dit het geval is, word het update systeem gedraaid.
     */
    update : function() {
        // check of er een nieuwe versie beschikbaar is
        version.check()
            .then( function( newVersion ) {
                if(newVersion) {
                    // voer de update uit
                    update.run( function() {
                        console.log("update succesvol uitgevoerd");
                    });
                }
            }, function( err ) {
                throw err;
            });
    },

    /**
     * Scan de externe HDD en parse elke file. De metadata die per bestand verzameld is,
     * wordt opgeslagen.
     */
    metadata : function() {
        // scan de directory
        metadata.scan( config.metadata.folder, function(err, files) {
            if(err) {
                throw err;
            }

            metadata.parse( files )
                .then( function( results ) {
                    return metadata.gather( results );
                })
                .then( function( results ) {
                    return metadata.save( results );
                })
                .then( function() {
                    console.log('done!!');
                }, function (error) {
                    console.error(error);
                });
        } );
    }
}


var w = new workflow();
w.metadata();

//w.update();



/*
scheduler.job( {
    hour : 10,
    minute : 31
}, function() {
    console.log("het werkt!");
});

*/

