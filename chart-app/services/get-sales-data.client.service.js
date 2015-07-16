'use strict';

angular.module('chart-app').factory('GetSalesData', ['$window', '$q',
	function($window, $q ) {
		var resume = {};

		return {
			getdata: function(jsonPath){
				var deferred = $q.defer();
				var d3 = $window.d3;
				var created_at;

				d3.csv(jsonPath, function(d) {
					var formatNumber = d3.format(',.2f');

					if (d.created_at !== ''){
							// console.log('d', d);
						  return {
						  	order_id: parseFloat(d.order_id),
						    created_at: d.created_at,
						    product_name: d.product_name,
						    grand_total: parseFloat(d.grand_total),
						    total_invoiced: parseFloat(d.total_invoiced),
						    billing_region: d.billing_region,
						    total_paid: parseFloat(d.total_paid),
						    subtotal: parseFloat(d.subtotal) ,
						    shipping_amount: parseFloat(d.shipping_amount),
						    remote_ip: d.remote_ip
						    //shipment_created_at
						  };
					}
				}, function(error, newdata) {
				  if (error) {
				  	console.log('getdata error', error);
				  	deferred.reject( error.statusText + ' - ' + error.responseURL);
				  } else if (newdata) {
				  	// console.log('getdata newdata ', newdata);
				  	deferred.resolve(newdata);
				  }
				});

				return deferred.promise;
			}
		};
	}

]);
