var fs = require('fs-extra'),
    Q = require('q'),
    url = require('url'),
    http = require('http');

/**
 *  Deze klasse zorgt ervoor dat externe afbeeldingen opgeslagen worden in
 *  een cache directory. Daarnaast wordt elke episode geupdate, zodat de afbeelding
 *  verwijst naar de gecachde afbeelding.
 */

exports.cache = {

    /**
     * Creeer
     *
     * @param dir
     */
    createDir : function( dir ) {
        fs.ensureDir(dir, function(err) {
            if(err) {
                throw err;
            }
        });
    },

    /**
     * Geeft de file name terug van een url.
     *
     * @param file url van de asset
     * @returns {filename}
     */
    getFileName : function(file) {
        var pathname = url.parse(file).pathname,
            filename = pathname.split("/").pop();

        return filename;
    },

    /**
     * Sla een afbeelding op in de cache. De afbeelding is afkomstig van een externe bron.
     *
     * @param folder
     * @param episode
     * @returns {Promise.promise|*}
     */
    save : function(folder, file) {
        var deferred = Q.defer(),
            dir = 'public/cache/' + folder.replace(/ /g,"-"),
            filePath = dir + '/' + this.getFileName(file);

        // garandeer dat de directory bestaat.
        // maak de directory aan indien deze nog niet bestaat, anders doe niks.
        this.createDir(dir);

        // haal de afbeelding op en schrijf hem weg naar de cache.
        var request = http.get(file, function(response){
            var imagedata = '';

            response.setEncoding('binary');
            response.on('data', function(chunk){
                imagedata += chunk;
            });

            response.on('end', function(){
                fs.writeFile(filePath, imagedata, 'binary', function(err){
                    if (err) {
                        deferred.reject(err);
                    }

                    // public prefix verwijderen van het path.
                    var paths = filePath.split('/');
                    paths.shift();

                    deferred.resolve( { path: paths.join('/') } );
                });
            });
        });

        return deferred.promise;
    },

    /**
     * Verwijder een cache directory.
     *
     * @param dir
     * @returns {Promise.promise|*}
     */
    remove : function( dir ) {
        var deferred = Q.defer();

        fs.remove('public/cache/' + dir + '/', function(err){
            if (err){
                deferred.reject(err);
            }
            deferred.resolve(true);
        });

        return deferred.promise;
    }
};