'use strict';

angular.module('chart-app').factory('Getlocation',['$q',
	function($q) {
		// Getlocation service logic

		// Public API
		return {
			getLocation: function($scope) {

				var deferred = $q.defer();

				// LOCATION ERROR
				function geo_error(error) {
					console.warn('ERROR(' + error.code + '): ' + error.message);
				  deferred.reject(error);
				}

				// LOCATION SUCCESS
				function geo_success(position) {
					console.log('Latitude : ' + position.latitude);
					console.log('Longitude: ' + position.longitude);
					console.log('More or less ' + position.accuracy + ' meters.');
				  deferred.resolve(position.coords);
				}

				if (navigator && navigator.geolocation) {
					// GET USERS LOCATION
					navigator.geolocation.getCurrentPosition(geo_success, geo_error); //geo_options
					return deferred.promise;
				} else {
					// TODO throw error
					console.log('no navigator or navigator.geolocation');
					// deferred.reject(error);
				}
			}
		};
	}
]);
