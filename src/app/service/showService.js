var Trakt = require('trakt');

var getMetadataFromTrakt = function(tvShow, callback) {
    var options = { query: tvShow, limit : 1 },
        trakt = new Trakt({ username: 'johnGestalt', password: '524f12bb3bb1ae9cbb9dad225186a972abc9771a'});

    trakt.request('search', 'shows', options, function(err, result) {
        if (err) {
            console.log('error retrieving tvshow info', err);
            callback(err, null);
        } else {
            var tvSearchResult = result[0];

            if (tvSearchResult !== undefined && tvSearchResult !== '' && tvSearchResult !== null) {
                callback(err, tvSearchResult);
            }
        }
    });
};


var getEpisodeInfoFromTrakt = function(options, callback) {
    var trakt = new Trakt({ username: 'johnGestalt', password: '524f12bb3bb1ae9cbb9dad225186a972abc9771a'});

    trakt.request('show', 'episode/summary', options, function(err, result) {
        if (err) {
            console.log('error retrieving tvshow info', err);
            callback(err, null);
        } else {
            var tvSearchResult = result;

            callback(err, tvSearchResult );
        }
    });
};
