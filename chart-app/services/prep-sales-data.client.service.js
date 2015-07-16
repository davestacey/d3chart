'use strict';

angular.module('chart-app').factory('PrepSalesData', [ '$q', '$window',
	function($q, $window) {
		// Prepweatherdata service logic

		var returnArray = [];

		// Public API
		return {
			prepData: function(rd) {
				// console.log('prepData raw ', rd);
				var deferred = $q.defer();
				var d3 = $window.d3;
				rd.reverse();

				function processelement(el, index, array) {
				  // Set the date format - created_at: "2015-07-03 15:08:41"
				  var format = d3.time.format('%Y-%m-%d %H:%M:%S');
				  var realdate = format.parse(el.created_at);
				  var shipping = Math.round(el.shipping_amount);
				  var gtotal = parseFloat(el.grand_total);
				  
				  if (gtotal > 1000) {
				  	// console.log('gtotal too high, ', el);
				  	return false;
				  }

				  // Don't add the row if there is no shipping
				  if (shipping === 0) {
				  	// console.log('no shipping amount, ');
				  	return false;
				  } else {
						// console.log('process el ', shipping );
					  returnArray.push([realdate, gtotal, shipping, el.product_name]);
					  // Note: this array is returned via promise resolve below
				  }
				}

				// EXTRACT ARRAY DATA POINTS
				rd.forEach(processelement);

				// return array via promise
				deferred.resolve(returnArray);
				return deferred.promise;

			}
		};
	}
]);