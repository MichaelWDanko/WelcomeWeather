/* jslint browser: true */
var angular = require('angular');
var angularRoute = require('angular-route');
var moment = require('moment');
require('./service');
//require('./templates');

var app = angular.module('welcomeApp', ['ngRoute', 'WeatherService']);

/*Router change data*/
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/today/:num', {
            controller: 'WeatherController',
            templateUrl: 'templates/weather.html',
        })
        .when('/days-from-now/:num', {
            controller: 'WeatherController',
            templateUrl: 'templates/future-weather.html',
        })
        .otherwise({
            redirectTo: '/today/0',
        });
}]);

app.controller('WeatherController', ['$scope', '$http', 'WeatherService', '$routeParams', function ($scope, $http, WeatherService, $routeParams) {
    //    $scope.city = 'Default';
    WeatherService.getCity().then(function (response) {
        //        console.log('New city' + response);
        $scope.city = response;
        $scope.$apply();
        //        console.log($scope.city);
    });

    console.log($routeParams.num);

    //This function is defining the scope for the controller to show the various weather.
    //It's using the $routeParams to identify which item fromt the array is needed.
    WeatherService.retrieveWeather().then(function (response) {
        console.log('Weather Data');
        console.log(response);

        //Check to see if the day is today to use current_condition
        if ($routeParams.num == 0) {
            $scope.temp = response.current_condition[0].temp_F;
            $scope.windspeed = response.current_condition[0].windspeedMiles;
            $scope.maxTemp = response.weather[$routeParams.num].maxtempF;
            $scope.minTemp = response.weather[$routeParams.num].mintempF;
        } else {
            $scope.maxTemp = response.weather[$routeParams.num].maxtempF;
            $scope.minTemp = response.weather[$routeParams.num].mintempF;
        }
        
        $scope.sunrise = response.weather[$routeParams.num].astronomy[0].sunrise;
        $scope.sunset = response.weather[$routeParams.num].astronomy[0].sunset;

        $scope.day = moment(response.weather[$routeParams.num].date).format('dddd');
        $scope.date = moment(response.weather[$routeParams.num].date).format('MMMM do, YYYY');


        //$scope.nav~ is the scope used to identify the dates on the nav bar
        $scope.navOne = moment(response.weather[1].date).format('MM/DD');
        $scope.navTwo = moment(response.weather[2].date).format('MM/DD');
        $scope.navThree = moment(response.weather[3].date).format('MM/DD');
        $scope.navFour = moment(response.weather[4].date).format('MM/DD');


        $scope.$apply();
    });

    //        $scope.date = WeatherService.returnWeather()[$routeParams.num].date;
}]);
