angular.module('EpisodeController', [])

    .controller("EpisodeList", ['$scope', 'ShowService', function($scope, ShowService) {

        ShowService.getAllSeasons('Suits')
            .then( function(result) {
                $scope.seasons = createSeasonListing( result.data.response.data.seasons );
            }, function(err) {

            });

        ShowService.getSeason('Suits', 1)
            .then( function( res ) {
                console.log(res.data.response.data);
                $scope.episodes =  res.data.response.data.episodes;
            }, function(err) {

            });


        function createSeasonListing( totalSeasons ) {
            var list = [];

            for( var i = 0, len = totalSeasons; i < len; i++) {
                list.push( (i+1) );
            }

            return list;
        }

    }]);