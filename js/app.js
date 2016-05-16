/* jslint browser: true */
var angular = require('angular');
var angularRoute = require('angular-route');
var moment = require('moment');
var pleaseWait = require('please-wait').pleaseWait;
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
                loadingHtml: '<div class="spinner"> <div class="bounce1"> </div> <div class="bounce2"> </div> <div class="bounce3"> </div> </div>'
            });
        } else {
            //Delete this else statement after testing/
            console.log('Page load did not occur');
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
        }


        $scope.maxTemp = response.weather[$routeParams.num].maxtempF;
        $scope.minTemp = response.weather[$routeParams.num].mintempF;
        $scope.sunrise = response.weather[$routeParams.num].astronomy[0].sunrise;
        $scope.sunset = response.weather[$routeParams.num].astronomy[0].sunset;
        $scope.day = moment(response.weather[$routeParams.num].date).format('dddd');
        $scope.date = moment(response.weather[$routeParams.num].date).format('MMMM do, YYYY');

        console.log('Test');
        console.log(response.weather[$routeParams.num].avgTemp);
        
        
        $scope.suggest = WeatherService.retrieveSuggestions(response.weather[$routeParams.num].avgTemp);
        console.log($scope.suggest);
        
        
        document.body.style.background = "#f3f3f3 url('" + response.weather[$routeParams.num].bgURL + "') no-repeat right top";
        document.body.style.backgroundSize = "cover";

        document.getElementById('icon').setAttribute('src', response.weather[$routeParams.num].iconURL);

        //$scope.nav~ is the scope used to identify the dates on the nav bar
        $scope.navOne = moment(response.weather[1].date).format('MM/DD');
        $scope.navTwo = moment(response.weather[2].date).format('MM/DD');
        $scope.navThree = moment(response.weather[3].date).format('MM/DD');
        $scope.navFour = moment(response.weather[4].date).format('MM/DD');

        $scope.$apply();
        
        //This sets the initial page load to true so the loading screen does not happen again.
        WeatherService.setPageLoad(true);
        
        if (loading_screen !== null) {
            loading_screen.finish();
        }
        
    }); //End of the WeatherService.retrieveWeather() function

}]);
