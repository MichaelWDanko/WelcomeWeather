/* jslint browser: true */
var angular = require('angular');
var angularRoute = require('angular-route');
require('./service');
//require('./templates');

var app = angular.module('welcomeApp', ['ngRoute', 'WeatherService']);

/*Router change data*/
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/today', {
            controller: 'WeatherController',
            templateUrl: 'templates/weather.html',
            daysFromNow: '0',
        })
        .when('/tomorrow', {
            controller: 'WeatherController',
            templateUrl: 'templates/weather.html',
            daysFromNow: '1',
        })
        .when('/2-days-from-now', {
            controller: 'WeatherController',
            templateUrl: 'templates/weather.html',
            daysFromNow: '2'
        })
        .when('/3-days-from-now', {
            controller: 'WeatherController',
            templateUrl: 'templates/weather.html',
            daysFromNow: '3'
        })
        .when('/4-days-from-now', {
            controller: 'WeatherController',
            templateUrl: 'templates/weather.html',
            daysFromNow: '4'
        })
        .otherwise({
            redirectTo: '/today',
        });
}]);

app.controller('WeatherController', ['$scope', '$http', 'WeatherService', function ($scope, $http, WeatherService) {
//    $scope.city = 'Default';
    WeatherService.getCity().then(function (response) {
        console.log('New city' + response);
        $scope.city = response;
        $scope.$apply();
        console.log($scope.city);
    });
}]);
