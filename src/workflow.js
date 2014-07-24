var scheduler = require('./schedule'),
    update = require('./update'),
    version = require('./version'),
    config = require('./config/config');

var workflow = function() {

};

workflow.prototype = {

    run : function(workflow) {

    },

    /**
     *
     */
    update : function() {
        // check of er een nieuwe versie beschikbaar is
        version.check()
            .then( function( newVersion ) {
                if(newVersion) {
                    // voer de update uit
                    update.run( function() {

                    });
                }
            }, function( err ) {
                throw err;
            });
    },

    metadata : function() {

    }
}


/**
 *

checkForUpdate : function() {

    version.check()
        .then( function( update ) {
            if(update) {
                // update is beschikbaar
            }
        }, function( err ) {

        });
}


 */

console.log( scheduler );

/*
scheduler.job( {
    hour : 10,
    minute : 31
}, function() {
    console.log("het werkt!");
});

*/

console.log( update );

/*
update.download( config.update.location )
    .then( function( data ) {
        console.log("unzipping update..");
        return update.unzip(data);
    })
    .then( function() {
        console.log("begin met install....");
        return update.install();
    })
    .then( function() {
        console.log("update geinstalleerd!");
    })
    .progress( function( progress ) {
        console.log( progress );
    });
*/