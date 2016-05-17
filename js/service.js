/* jslint browser: true */
/* jslint esnext: true */

module.exports = (function () {
    var service = angular.module('WeatherService', []);

    service.factory('WeatherService', function ($http) {

        // An array listing the clothes that could be pulled from based upon temp.
        var clothesArray = [
            {
                name: 'Tank-top',
                minTemp: 75,
                maxTemp: 150,
            },
            {
                name: 'T-shirt',
                minTemp: 70,
                maxTemp: 150
            },
            {
                name: 'Bathing Suit',
                minTemp: 75,
                maxTemp: 150
            },
            {
                name: 'Shorts',
                minTemp: 70,
                maxTemp: 150
            },
            {
                name: 'Polo shirt ',
                minTemp: 70,
                maxTemp: 150
            },
            {
                name: 'Sunglasses',
                minTemp: 0,
                maxTemp: 150
            },
            {
                name: 'Flip-flops',
                minTemp: 75,
                maxTemp: 150
            },
            {
                name: 'Button down/Long-sleeve shirt',
                minTemp: 55,
                maxTemp: 74
            },
            {
                name: 'Light sweater',
                minTemp: 55,
                maxTemp: 74
            },
            {
                name: 'Pants/Jeans',
                minTemp: -150,
                maxTemp: 150
            },
            {
                name: 'Heavy jacket',
                minTemp: -150,
                maxTemp: 54
            },
            {
                name: 'Scarf',
                minTemp: -150,
                maxTemp: 50
            },
            {
                name: 'Beanie/Ski hat',
                minTemp: -150,
                maxTemp: 54
            },
            {
                name: 'Boots',
                minTemp: -150,
                maxTemp: 54
            },
            {
                name: 'Gloves',
                minTemp: -150,
                maxTemp: 54
            },
        ];

        //An array listing the possible conditions for icons.
        //Sunny -> Cloudy -> Rain -> Snow -> Storm
        var conditionsObject = {
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
            116: 'sunny',
            113: 'sunny',
        };
        var weather = [];

        /*
        These variables are a benchmark to assist in the caching of geolocation
        and weather service data.
        */
        var coordinates = null;
        var pageLoad = false;

        function getLatLong() {
            return new Promise(function (resolve, reject) {
                if ("geolocation" in navigator) {
                    console.log(`Geolocation is accessible. Retrieving location`);

                    if (coordinates == null) {
                        // There is no position data;
                        console.log(`No data`);
                        navigator.geolocation.getCurrentPosition(function (position) {

                            coordinates = position;
                            //resolve is a function that runs when the promise is fulfilled
                            resolve({
                                longitude: position.coords.longitude,
                                latitude: position.coords.latitude,
                            });
                        });
                    } else {
                        //We do have position data
                        console.log(`Position is set`);
                        resolve({
                            longitude: coordinates.coords.longitude,
                            latitude: coordinates.coords.latitude,
                        });
                    }
                } else {
                    console.log(`Geolocation is not accessible`);
                    reject(`Geolocation is not accessible`);
                }
            });
        }

        function getCoordinateWeather(longitude, latitude) {
            //Retrieve the weather given a longitude/latitude from WorldWeatherOnline.com
            return getLatLong().then(function (position) {

                    if (weather.length == 0) {
                        //There is no weather data so you must make an API request
                        console.log('There is no weather data');
                        return $http({
                            method: 'GET',
                            url: "http://api.worldweatheronline.com/premium/v1/weather.ashx?key=0bc76a7e21c94295aa7192226160905&q=" + position.latitude + ',' + position.longitude + "&includelocation=yes&num_of_days=5&format=json",
                        });
                    } else {
                        //There is weather information saved so we don't need to.
                        console.log('There is data');
                        return weather;
                    }
                })
                .then(function (response) {
                    if (weather.length == 0) {
                        console.log(`Setting data`);
                        weather = response;
                        return response.data.data;
                    } else {
                        return response.data.data;
                    }
                })
                .then(function (response) {
                    console.log(response);

                    /*
                    The response does not return a single weather code for upcoming days.
                    Instead it returns a weather code for every 3 hours, so I am running a loop to
                    aggregate all of the codes and figure out which is the most common for the day.
                    */

                    //This for loop runs through the array of days, ignoring day 0 because we already have the code.
                    for (var i = 0; i < response.weather.length; i++) {

                        // countArray is the array to push all of the hourly codes into.
                        var countArray = [];

                        //This for loop runs through the array of hourly weather predictions for each day
                        for (var x = 0; x < response.weather[i].hourly.length; x++) {
                            countArray.push(Number(response.weather[i].hourly[x].weatherCode));
                        }


                        //This is using the For Loops before attempting the reduce function.
                        var codeMap = {};
                        var highestCode = countArray[0];
                        var highestCount = 1;

                        /*
                        This for loop is running through the object codeMap
                        and is setting highestCode to the most frequent weather code for the day.
                        */
                        for (var z = 0; z < countArray.length; z++) {
                            var num = countArray[z];
                            if (codeMap[num] == null) {
                                codeMap[num] = 1;
                            } else {
                                codeMap[num] = codeMap[num] + 1;
                            }
                            if (codeMap[num] > highestCount) {
                                highestCode = num;
                                highestCount = codeMap[num];
                            }
                        }
                        response.weather[i].avgWeatherCode = highestCode;
                        response.weather[i].avgTemp = ((Number(response.weather[i].maxtempF) + Number(response.weather[i].mintempF)) / 2);

                    }
                    /* ^^^
                    End of the for-loop that is running through the API results 
                    and is appending the weather code to future days.
                    */


                    return response;
                })
                .then(function (response) {
                    //                    //This function is to append the WeatherIcon/Background image(s) url onto the data of the response.

                    for (var i = 0; i < response.weather.length; i++) {
                        var url = response.weather[i].avgWeatherCode;
                        response.weather[i].iconURL = "./images/" + conditionsObject[url] + ".png";
                        response.weather[i].bgURL = "./images/bg/" + conditionsObject[url] + ".jpg";
                    }
                    return response;
                });
        }

        //Using a latitude/longitude paramters, use the Google Geocode API to return the city.
        function getCityName() {
            return getLatLong().then(function (position) {
                var latlng = position.latitude + ',' + position.longitude;
                return $http({
                    method: 'GET',
                    url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&key=AIzaSyD2aCA3hCNOWzcAJioYxXh3eF5jfW3pXhg"
                });
            }).
            then(function (response) {
                    return response.data.results;
                })
                .then(function (response) {
                    for (var i = 0; i < response[0].address_components.length; i++) {
                        if (response[0].address_components[i].types.indexOf('locality') !== -1) {
                            return response[0].address_components[i].long_name;
                        }
                    }
                });
        }

        return {
            retrieveLatLngWeather: getCoordinateWeather,
            getCity: getCityName,
            retrieveConditions: function () {
                return conditionsObject;
            },
            retrieveTodaysCondition: function (code) {
                return conditionsObject[code];
            },
            retrieveClothes: function () {
                return clothesArray;
            },
            setPageLoad: function (input) {
                pageLoad = input;
            },
            retrievePageLoad: function () {
                return pageLoad;
            },
            retrieveSuggestions: function (temp) {
                    console.log(`Running retrieveSuggestions`);
                    var suggestArray = [];
                    // clothesArray is a list of objects with following properties:
                    // name: minTemp: maxTemp:
                    for (var i = 0; i < clothesArray.length; i++) {
                        if (temp >= clothesArray[i].minTemp && temp <= clothesArray[i].maxTemp) {
                            suggestArray.push(clothesArray[i].name);
                        }
                    } //End of the forLoop running through the possible items
                    console.log(suggestArray);
                    return suggestArray;
                } // End of the retrieveSuggestions function
        };
    });
})();
