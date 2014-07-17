angular.module('showService', [])

    .factory('ShowService', function($http) {
        return {

            /**
             * Geeft alle shows terug
             *
             * @returns {Promise} JSON object met shows data
             */
            all : function() {
                return $http.get('api/show');
            },

            /**
             * Haal een enkele show op
             *
             * @param id
             * @returns {Promise} JSON object met show data
             */
            get : function( id ) {
                return $http.get('api/show', id);
            },

            getSeason : function(title, season) {
                return $http( {
                    method : 'POST',
                    url : 'api/show/' + title + '/' + season,
                    data : {
                        title: title,
                        season: season
                    }
                });
            }
        };
    });