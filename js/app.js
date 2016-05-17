/* jslint browser: true */
var angular = require('angular');
var angularRoute = require('angular-route');
var moment = require('moment');
var pleaseWait = require('please-wait').pleaseWait;
require('./service');

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
    var loading_screen = null;
    $scope.$on('$viewContentLoaded', function () {

        /*
        Test to see whether the loading screen should be run or not.
        A Boolean is set at initial page load to false. 
        When page is loaded the first time, it's set to false when loading screen is dismissed.
        */
        if (WeatherService.retrievePageLoad() === false) {

            console.log('$viewContentLoaded. Rendering loading screen.');
            loading_screen = pleaseWait({
                logo: "images/logo.png",
                backgroundColor: "#0047BD",
                loadingHtml: '<div><h1 class="loadingMessage"> Welcome Weather requires your current location.  </h1> <h1 class="loadingMessage"> Loading... </h1></div> <div class="spinner"><div class="cube1"></div> <div class="cube2"></div></div>'
            });
        } 
        
    });
    WeatherService.getCity().then(function (response) {
        $scope.city = response;
        $scope.$apply();
    });

    //This function is defining the scope for the controller to show the various weather.
    //It's using the $routeParams to identify which item fromt the array is needed.
    WeatherService.retrieveLatLngWeather().then(function (response) {

        //Check to see if the day is today to use current_condition
        //Since there is different data recieved for current days and future days
        //there must be a way to set the scopes to different parameters
        if ($routeParams.num == 0) {
            $scope.temp = response.current_condition[0].temp_F;
            $scope.windspeed = response.current_condition[0].windspeedMiles;

            document.body.style.background = "#f3f3f3 url('./images/bg/" + WeatherService.retrieveTodaysCondition(response.current_condition[0].weatherCode) + ".jpg') no-repeat fixed right top";
            document.body.style.backgroundSize = "cover";
        } else {
            document.body.style.background = "#f3f3f3 url('" + response.weather[$routeParams.num].bgURL + "') no-repeat fixed right top";
            document.body.style.backgroundSize = "cover";
        }

        document.getElementById('icon').setAttribute('src', response.weather[$routeParams.num].iconURL);

        $scope.maxTemp = response.weather[$routeParams.num].maxtempF;
        $scope.minTemp = response.weather[$routeParams.num].mintempF;
        $scope.sunrise = response.weather[$routeParams.num].astronomy[0].sunrise;
        $scope.sunset = response.weather[$routeParams.num].astronomy[0].sunset;
        $scope.day = moment(response.weather[$routeParams.num].date).format('dddd');
        $scope.date = moment(response.weather[$routeParams.num].date).format('MMMM Do, YYYY');
        $scope.suggest = WeatherService.retrieveSuggestions(response.weather[$routeParams.num].avgTemp);
    

        //$scope.nav~ is the scope used to identify the dates on the nav bar
        $scope.navOne = moment(response.weather[1].date).format('MM/DD');
        $scope.navTwo = moment(response.weather[2].date).format('MM/DD');
        $scope.navThree = moment(response.weather[3].date).format('MM/DD');
        $scope.navFour = moment(response.weather[4].date).format('MM/DD');

        $scope.$apply();

        //This sets the initial page load to true so the loading screen does not happen again.
        WeatherService.setPageLoad(true);

        //Checks to see if the variable is set so that the loading screen wouldn't load between view changes 
        if (loading_screen !== null) {
            loading_screen.finish();
        }

    }); //End of the WeatherService.retrieveWeather() function

}]);
