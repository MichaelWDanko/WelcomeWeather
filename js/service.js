/* jslint browser: true */
/* jslint esnext: true */

module.exports = (function () {
    var service = angular.module('WeatherService', []);

    service.factory('WeatherService', function ($http) {

        //        /*Coordinates for Packard Place downtown Charlotte to test*/
        //        var longitude = 35.227234;
        //        var latitude = -80.846247;

        var latitude = 0;
        var longitude = 0;
        //        var cityName = "Default City Name";

        function getLatLong() {
            return new Promise(function (resolve, reject) {
                if ("geolocation" in navigator) {
                    console.log(`Geolocation is accessible`);
                    navigator.geolocation.getCurrentPosition(function (position) {
                        console.log(position);

                        resolve({
                            longitude: position.coords.longitude,
                            latitude: position.coords.latitude,
                        });
                    });
                } else {
                    console.log(`Geolocation is not accessible`);
                    reject(`Geolocation is not accessible`);
                }
            });
        }


        function getCoordinateWeather(longitude, latitude) {
            //Retrieve the weather given a longitude/latitude from WorldWeatherOnline.com
            return getLatLong().then(function (position) {

                    return $http({
                        method: 'GET',
                        url: "http://api.worldweatheronline.com/premium/v1/weather.ashx?key=0bc76a7e21c94295aa7192226160905&q=" + position.latitude + ',' + position.longitude + "&includelocation=yes&num_of_days=5&format=json"
                    });
                })
                .then(function (response) {
//                    console.log('The weather:');
//                    console.log(response);
                    return response.data.data;
                });
        }
        getCoordinateWeather();


        //Using a latitude/longitude paramters, use the Google Geocode API to return the city.
        function getCityName() {
            //            var latlng = latitude + ',' + longitude;
            //            console.log(latlng);
            return getLatLong().then(function (position) {
                var latlng = position.latitude + ',' + position.longitude;
                return $http({
                    method: 'GET',
                    url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&key=AIzaSyD2aCA3hCNOWzcAJioYxXh3eF5jfW3pXhg"
                });
            }).
            then(function (response) {
//                    console.log('getCityName');
//                    console.log(response);
                    return response.data.results;
                })
                .then(function (response) {
//                    console.log(response);
                    for (var i = 0; i < response[0].address_components.length; i++) {
                        if (response[0].address_components[i].types.indexOf('locality') !== -1) {
//                            console.log(response[0].address_components[i].long_name);
                            return response[0].address_components[i].long_name;
                        }
                    }
                });
        }

        return {
            retrieveWeather: getCoordinateWeather,
            // Sets retrieveWeather to the function getWeather.
            // It has the same inputs

            //Returns the cityName variable
            getCity: getCityName,

            
        };
    });
})();
