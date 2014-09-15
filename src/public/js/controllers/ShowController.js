angular.module('ShowController', []).

    controller('Show', ['$scope', 'ShowService', function($scope, ShowService) {


        ShowService.get()
            .then( function( res ) {
               $scope.shows =  res.data.response.data;
            }, function(err) {

            });

        $scope.getEpisodeList = function(tvshow, event) {

            ShowService.getAllSeasons( tvshow )
                .then( function( response) {
                    console.log( response );
                }, function( err) {
                    console.log( err );
                });
        };

    }]);