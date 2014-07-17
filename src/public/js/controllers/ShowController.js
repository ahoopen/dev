angular.module('ShowController', []).

    controller('Show', ['$scope', 'ShowService', function($scope, ShowService) {


        ShowService.get()
            .then( function( res ) {
               $scope.shows =  res.data.response.data;
            }, function(err) {

            });

    }]);