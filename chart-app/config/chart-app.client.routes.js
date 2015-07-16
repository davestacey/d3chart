'use strict';

//Setting up route
angular.module('chart-app').config(['$stateProvider',
	function($stateProvider) {
		// Chart app state routing
		$stateProvider.
		state('chart-app', {
			url: '/chart-app',
			templateUrl: 'modules/chart-app/views/chart-app.client.view.html'
		}).
    state('chart-weather', {
      url: '/chart-weather',
      templateUrl: 'modules/chart-app/views/chart-weather.client.view.html'
    }).
    state('chart-sales', {
      url: '/chart-sales',
      templateUrl: 'modules/chart-app/views/chart-sales.client.view.html'
    });
	}
]);