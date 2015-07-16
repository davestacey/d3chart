'use strict';

angular.module('chart-app').factory('Getweatherdata', [ '$http',
	function($http) {
		// Getweatherdata service logic

		// ---------- forecast.io
		// Hour-by-hour forecasts out to 48 hours
		// https://developer.forecast.io/docs/v2
		// Note: If testing locally: open -a Google\ Chrome --args --disable-web-security , or change to jsonp.
		// ------------------

		// ---------- openweathermap.org 
		// -- (No Need to --disable-web-security)
		// Call 5 day / 3 hour forecast data
		// 'http://api.openweathermap.org/data/2.5/forecast?lat=39.7698122&lon=-105.0148322';
		// Call 16 day / daily forecast data
		// api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}
		// Call 10 days forecast by geographic coordinates 
		// api.openweathermap.org/data/2.5/forecast/daily?lat=35&lon=139&cnt=10 
		// Todays weather
		// var weatherpath_today = 'http://api.openweathermap.org/data/2.5/weather?lat=39.7698122&lon=-105.0148322';
		// ------------


		// WEATHER API LOGIC
		return {
			getWeather: function(location){
				// console.log('getWeather', location);

				// LOCATION
				var latitude = location.latitude;
				var longitude = location.longitude;

				// API SERVICES
				// var openweathermap_5day_3hr = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude;
				var forecast_io = 'https://api.forecast.io/forecast/xxxxxxx/' + latitude +',' + longitude;
				var forecast_io_jsonp = 'https://api.forecast.io/forecast/xxxxxxxx/' + latitude +',' + longitude + '/?callback=JSON_CALLBACK';

				// GET THE FORECAST 
				// return $http.get(forecast_minutely).
				return $http.jsonp(forecast_io_jsonp).
				  success(function(response) {
				    // console.log('weather data success', response);
				    return response;
				  }).
				  error(function(data, status, headers, config) {
				    console.log('Error, config= ', config);
				    return false;
				  });
			} // end getWeather
		};
	}
]);

// Prediction Notes:
// http://usatoday30.usatoday.com/weather/wfbarrow.htm
// http://www.weatherworksinc.com/high-low-pressure

