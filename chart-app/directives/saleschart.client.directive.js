'use strict';

angular.module('chart-app').directive('saleschart', [ 
  function() {

    return {
      restrict: 'EA',
      replace: false,
      scope: {
        data: '=', // bi-directional data-binding
        onClick: '&'  // parent execution binding
      },
      // css: '../css/linechart.css',
      template: "<div class='scatterheader'></div>  <svg width='850' height='300'></svg>",
      controller: 'SalesChartController',
      link: function postLink(scope, elem, attrs, salesChartCtrl) {
        salesChartCtrl.init( elem );
      } // end link
    }; //end return
  }
]);