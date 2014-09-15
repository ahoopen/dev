var app = angular.module('screenApp', [
    'ngRoute',
    //   'ShowController',
    'EpisodeController',
    'showService'
]);


app.config( function($routeProvider) {

    $routeProvider

        .when('/', {
            templateUrl : '../show.html',
            controller : 'ShowController'
        })

        .when('/episodes', {
            templateUrl : '../episodes.html',
            controller : 'EpisodeController'
        })
});