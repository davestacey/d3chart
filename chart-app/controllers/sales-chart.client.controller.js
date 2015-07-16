'use strict';

angular.module('chart-app').controller('SalesChartController', ['$scope', '$window', 'GetSalesData', 'PrepSalesData',
	function($scope, $window, GetSalesData, PrepSalesData ) {
		// Sales chart controller logic
    console.log('SalesChartController');
		var self = this;



    this.init = function( elem ) {
      self.$elem = elem;
      console.log('self.$elem', self.$elem);

      var loadSalesData = function( )
          {
            return GetSalesData
              .getdata('/data/order_export_20150710_173407.csv')
                .then(function(data) {
                  if (data){
                    console.log('1- getData success');
                    // console.log('data: ', data);
                    // NEXT STEP
                    processData(data);
                  } else {
                    console.log('success but location not present');
                  }

                 }, function(error) {
                    console.log('getdata error2', error);
                    // ERROR MESSAGE
                    scope.showWarning = true;
                    scope.warning = 'We could not get your data';
                    // ERROR TODO offer a selection field to manually select location
                    return false;
                 });
          },
          processData = function(rawData) {
            return PrepSalesData
              .prepData( rawData )
              .then( function( usableData )
              {
                console.log('2- processData success');
                // console.log('2- processed data returned: ', usableData);

                // NEXT STEP
                $scope.salesData = usableData;
                dataToPlot = usableData;
                drawChart();

                // buildChart(usableData);
              }, function() {
                  // ERROR MESSAGE
                  scope.showWarning = true;
                  scope.warning = 'We could not process the data.';
                  // ERROR TODO offer a selection field to manually select location
                  return false;
               });
      }; // end loadData
      loadSalesData();
      $scope.warning = null;
      $scope.salesData = null;
      // $scope.data = null;

      // Gather the basic data needed for plotting the chart.
      var dataToPlot = null;
      // var padding = 20;
      var xScale, yScale, xAxisGen, yAxisGen, gSymbols, mainSvg, tooltip;
           
      var d3 = $window.d3;
      var rawSvg = elem.find("svg")[0];
      var svg = d3.select(rawSvg);
      var elementParent = d3.select(elem[0]); // Attach tooltip to this

      // Set Chart positioning, size
      var margin = {top: 20, right: 10, bottom: 90, left: 80};

      var widthAlter = (margin.left + margin.right);
      var heightAlter = (margin.top + margin.bottom);
      console.log('heightAlter', heightAlter);

      var width = elem.width() - widthAlter;
      var height = elem.height() - heightAlter ;


      // var chartheader = elem.find('.scatterheader');
      // var rawSvg = elem.find('svg');
      // var svg = d3.select(rawSvg[0]);

      ////////////////
      // Allow the user of our directive to define...
      // var marginPassed = parseInt(attrs.margin) || 20,
      //     barHeight = parseInt(attrs.barHeight) || 20,
      //     barPadding = parseInt(attrs.barPadding) || 5;
      // // ...


      // watch data for changes and redraw
      // Data gets changed via the Controller promise
      $scope.$watch('data', function(newVals, oldVals) {
         // ignore first call which happens before we even have data
         if (newVals === oldVals) {
           return;
         }
         if (newVals) {
          console.log('$watch data changed');
          // console.log('new data= ', newVals);
          dataToPlot = newVals;
          drawChart();
         }
      }, true);
      

      // RESIZE
      function redrawChart() {
        console.log('redrawChart');

        width = elem.width() - widthAlter;
        height = elem.height() - heightAlter ;

        mainSvg.remove();
        drawChart();

      } 

      var resizeTimeout;
      window.onresize = function() {
        console.log('onresize');
        clearTimeout(resizeTimeout);

        // TODO Hide chart, fade out & fade in
        resizeTimeout = setTimeout(function() {
           // handle after finished resize
           console.log('resize is finished?');
           redrawChart();
        }, 250); // set for 1/4 second.  May need to be adjusted.
      };


      //setChartParameters
      function setChartParameters(){

        var data = dataToPlot;
        console.log('setChartParameters');

        // X AXIS SCALE
        // Start Date - for X axis
        var startDate = new Date( data[0][0] );
        // Offset by x hours, so symbols dont run into axis
        startDate = d3.time.hour.offset(startDate, -5);

        // End Date - For X axis
        var endDate = new Date( data[data.length - 1][0] );
        endDate = d3.time.hour.offset(endDate, +5);

        // xScale
        xScale = d3.time.scale()
                         .domain([ startDate, endDate ])
                         // .rangeRound([0, width - margin.left - margin.right]);
                         .rangeRound([0, width - margin.right]);

        xScale.ticks(d3.time.hour, 12);


        // add the graph canvas to the body of the webpage
        mainSvg = svg
                    .attr('width', width)
                    .attr('height', height )
                    .attr('class', 'chart')
                    .style('overflow', 'visible')
                  .append('g')
                    .attr('transform', 'translate(' + (margin.left) + ',' + margin.top + ')')
                    .attr('width', 0)
                    .attr('height', 0)
                    .attr('class', 'mainSvg');

        // X xAxisGen Generation
        xAxisGen = d3.svg.axis()
                         .scale( xScale )
                         .orient('bottom')
                         .tickPadding(6)
                         .tickSize(10)
                         .tickFormat(function(d) { 
                           // Set the day format
                           var dayNameFormat = d3.time.format('%A' );
                           var dayName = dayNameFormat(d);  //returns string "Thursday"

                           // Set the date format
                           var dateFormat = d3.time.format('%m/%d' );
                           var dateDisplay = dateFormat(d);  //returns string "Thursday"

                           // Alternate the ticks for new days
                           var hours = d.getHours();
                           if (hours === 0) {
                             return dateDisplay;
                           } else {
                             return null;
                           }
                         });

        // Y AXIS SCALE
        var miny = d3.min(data, function(d) { return d[1]; });
        var maxy = d3.max(data, function(d) { return d[1]; });
        yScale = d3.scale.linear()
                        .domain([miny -20, maxy +100])
                        .range([ height, 0 ]);

        // Y AXIS Generation
        // draw the y axis -X
        yAxisGen = d3.svg.axis()
                         .scale(yScale)
                         .orient('left')
                         .tickFormat(function(d) { 
                            return '$' + d;
                          });
      };


      function drawChart() {
        // This function only runs once, not on resize
        console.log('drawChart');

        setChartParameters();

        // TOOLTIP
        var tooltipWidth = 160;
        elementParent.style('position', 'relative');
        tooltip = elementParent.append('div')
                               .attr('class', 'tooltip')
                               .style('width', tooltipWidth +'px' )
                               .style('opacity', 0);

        // attach X dateAxis
        mainSvg.append('g')
               .attr('transform', 'translate(0,' + height + ')')
               .attr('class', 'x axis date')
               .call(xAxisGen)
              .selectAll('text')
               .attr('y', 17)
               .attr('x', -18)
               // .attr('dy', '1.2em')
               // .attr('transform', 'rotate(90)')
               .style('font-weight', 'bold')
               .style('font-size', '0.8em')
               .style('text-anchor', 'start');

        // attach the x label
        mainSvg.append('text')
               .attr('x', width / 2)
               .attr('y', height +45 )
               .attr('dy', '1em')
               .attr('class', 'x label-xaxis')
               .style('text-anchor', 'middle')
               .text('Invoice Date');
               // .attr('transform', 'rotate(-90)')

        // attach the y axis
        mainSvg.append('g')
              .attr('transform', 'translate(0,0)')
              .attr('class', 'y axis date')
              .call(yAxisGen);

        // attach the y label
        mainSvg.append('text')
              .attr('transform', 'rotate(-90)')
              // .attr('y', 50)
              // .attr('x', 80)
              .attr('y', -margin.left )
              .attr('x', -(height / 2))
              .attr('dy', '1em')
              .attr('class', 'y label-yAxisGen')
              .style('text-anchor', 'middle')
              .text('Sales Price');

        drawSymbols();

      }; // end drawChart


      // DRAW SYMBOLS
      function drawSymbols() {
        console.log('drawSymbols');

        var data = dataToPlot;

        // attach Scatter symbols
        gSymbols = mainSvg.append('svg:g')
                          .attr('class', 'symbolGroup'); 

        // SCATTER SYMBOLS
        var initialOpacity = 0.3;

        // Set scale for circle radius
        var minc = d3.min(data, function(d) { return d[2]; });
        var maxc = d3.max(data, function(d) { return d[2]; });

        var radiusScale = d3.scale.linear()
                            .domain([minc, maxc])
                            .range([5,50]);


        gSymbols.selectAll('scatter-dots')
          .data(data)
          .enter().append('svg:circle')
                .attr('cx', function (d,i) { return xScale(d[0]); })
                .attr('cy', function (d) { return yScale(d[1]); })
                .attr('r', function (d) { 
                   // apply scale for circle radius
                   return radiusScale(d[2]);
                 })
                .attr('text-anchor', 'middle')
                .style('opacity', initialOpacity )
                .on('mouseover', function(d) {
                 // TOOLTIP ROLLOVER
                  var cirx = +this.getAttribute('cx');
                  var ciry = +this.getAttribute('cy');

                  // change opacity on rollover
                  d3.select(this).style('opacity', 0.8);

                  // show tooltip on rollover
                  tooltip.transition()
                   .duration(100)
                   .style('opacity', 0.9);
                  // TOOLTIP CONTENT & POSITION
                  // ([realdate, gtotal, shipping, el.product_name]);
                  tooltip.html('Grand Total: <strong>' + d[1] + '</strong> </br> Shipping: <strong> ' + d[2] + '</strong> </br> Product: <strong> ' + d[3] + '</strong>')
                   .style('left', ( cirx ) + 'px')
                   .style('top', ( ciry +40 ) + 'px');
                })
                .on('mouseout', function(d) {
                  // reset tooltip
                  tooltip.transition()
                  .duration(500)
                  .style('opacity', 0);
                  // reset symbol
                  d3.select(this).style('opacity', initialOpacity);
                }
        ); // gSymbols.selectAll('scatter-dots')
      }
    };
	}
]);