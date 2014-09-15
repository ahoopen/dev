angular.module('EpisodeController', ['ngRoute'])

    .controller("EpisodeList", ['$scope', 'ShowService', function($scope, ShowService) {



        ShowService.getAllSeasons('Californication')
            .then( function(result) {
                $scope.seasons = createSeasonListing( result.data.response.data.seasons );
            }, function(err) {

            });

        ShowService.getSeason('Californication', 1)
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