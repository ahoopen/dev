angular.module('EpisodeController', [])

    .controller("EpisodeList", ['$scope', 'ShowService', function($scope, ShowService) {

        ShowService.getSeason('Suits', 1)
            .then( function( res ) {
                console.log(res.data.response.data);
                $scope.episodes =  res.data.response.data.episodes;
            }, function(err) {

            });
    }]);