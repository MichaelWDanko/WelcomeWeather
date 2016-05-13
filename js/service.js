/* jslint browser: true */
/* jslint esnext: true */

module.exports = (function () {
    var service = angular.module('WeatherService', []);

    service.factory('WeatherService', function ($http) {

        var latitude = 0;
        var longitude = 0;
        
        var clothesArray = [
            {name: 'Tank-top', minTemp: 75, maxTemp: 150, conditions: 'sunny' },
            {name: 'T-shirt', minTemp: 70, maxTemp: 150 },
            {name: 'Bathing Suit', minTemp: 75, maxTemp: 150 },
            {name: 'Shorts', minTemp: 70, maxTemp: 150 },
            {name: 'Polo shirt ', minTemp: 70, maxTemp: 150 },
            {name: 'Sunglasses', minTemp: 0, maxTemp: 150 },
            {name: 'Flip-flops', minTemp: 75, maxTemp: 150 },
            {name: 'Button down/Long-sleeve shirt', minTemp: 55, maxTemp: 74 },
            {name: 'Light sweater', minTemp: 55, maxTemp: 74 },
            {name: 'Pants/Jeans', minTemp: -150, maxTemp: 150 },
            {name: 'Heavy jacket', minTemp: -150, maxTemp: 54 },
            {name: 'Scarf', minTemp: -150, maxTemp: 50 },
            {name: 'Beanie/Ski hat', minTemp: -150, maxTemp: 54 },
            {name: 'Boots', minTemp: -150, maxTemp: 54 },
            {name: 'Gloves', minTemp: -150, maxTemp: 54 },
            {name: 'name', minTemp: 0, maxTemp: 150 },
        ];
        
        //An array listing the possible conditions for icons.
        //Sunny -> Cloudy -> Rain -> Snow -> Storm
        var conditionsArray = {
            395: 'snow',
            392: 'snow',
            389: 'storm',
            386: 'storm',
            374: 'rain',
            371: 'snow',
            368: 'snow',
            365: 'rain',
            362: 'rain',
            359: 'storm',
            356: 'rain',
            353: 'rain',
            350: 'snow',
            338: 'snow',
            335: 'snow',
            332: 'snow',
            329: 'snow',
            326: 'snow',
            323: 'snow',
            320: 'rain',
            317: 'rain',
            314: 'rain',
            311: 'rain',
            308: 'storm',
            305: 'storm',
            302: 'rain',
            299: 'rain',
            296: 'rain',
            293: 'rain',
            284: 'storm',
            281: 'rain',
            266: 'rain',
            263: 'rain',
            260: 'cloudy',
            248: 'cloudy',
            230: 'snow',
            227: 'snow',
            200: 'storm',
            185: 'cloudy',
            182: 'cloudy',
            179: 'cloudy',
            176: 'rain',
            143: 'cloudy',
            122: 'cloudy',
            119: 'cloudy',
            116: 'cloudy',
            113: 'sunny',
            
            
        };
    
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
            getCity: getCityName,
            retrieveConditions: function () {
                return conditionsArray;
            },
            retrieveClothes: function () {
                return clothesArray;
            }
        };
    });
})();
