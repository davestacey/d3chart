'use strict';

angular.module('chart-app').factory('Prepweatherdata', [ '$q', '$window',
	function($q, $window) {
		// Prepweatherdata service logic

		var returnArray = [];

		// Public API
		return {
			prepData: function(weatherData) {
				var forecasts_openweathermap = weatherData.data.list;
				var forecasts_forecastio = weatherData.data.hourly.data;
				var deferred = $q.defer();
				var d3 = $window.d3;

				function getForecastDetails(element, index, array) {
					// console.log('process forecast ', element );
				  var pressure = element.pressure ;
				  var windSpeed = element.windSpeed ;
				  var windBearing = element.windBearing;
				  var time = element.time;
					// convert Unix time to a Date object (via milliseconds)
					var time2 = new Date(time * 1000);
				  returnArray.push([time2, pressure, windSpeed, windBearing]);
				}

				// EXTRACT ARRAY DATA POINTS
				forecasts_forecastio.forEach(getForecastDetails);

				deferred.resolve(returnArray);
				return deferred.promise;

			}
		};
	}
]);