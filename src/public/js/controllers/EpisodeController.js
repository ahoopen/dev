angular.module('EpisodeController', [])

    .controller("EpisodeList", ['$scope', 'ShowService', function($scope, ShowService) {

        ShowService.getAllSeasons('Game of Thrones')
            .then( function(result) {
                $scope.seasons = createSeasonListing( result.data.response.data.seasons );
            }, function(err) {

            });

        ShowService.getSeason('Game of Thrones', 1)
            .then( function( res ) {
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