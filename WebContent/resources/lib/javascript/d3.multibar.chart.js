function d3MultiBarChart(id, fData,width,height) {
	if(fData.length!=0){
		
	
	
	$("#loading-img-id").hide();// hiding ajax loading image of this chart panel
	var revenueBarColor = '#0AD7FF';
	var countBarColor = "#663EC3";
	function segColor(c) {
		return {
			low : "#807dba",
			mid : "#e08214",
			high : "#41ab5d"
		}[c];
	}

	// compute total for each state.
	fData.forEach(function(d) {
		d.total = d.freq;
	});
	fData.forEach(function(d) {
		d.countTotal = d.count;
	});

	// function to handle histogram.
	function histoGram(fD) {
		var hG = {}, hGDim = {
			t : 60,
			r : 0,
			b : 30,
			l : 0
		};
		hGDim.w = width- hGDim.l - hGDim.r, hGDim.h = height - hGDim.t - hGDim.b;

		var y = d3.scale.linear().range([ hGDim.h, 0 ]).domain(
				[ 0, d3.max(fD, function(d) {
					return d[1];
				}) ]);
		var y1 = d3.scale.linear().range([ hGDim.h, 0 ]).domain(
				[ 0, d3.max(fD, function(d) {
					return d[2];
				}) ]);
		// create svg for histogram.
		var hGsvg = d3.select(id).text("").append("svg").attr("width",hGDim.w + hGDim.l + hGDim.r).attr("height",
				hGDim.h + hGDim.t + hGDim.b).append("g").attr("transform",
				"translate(" + hGDim.l + "," + hGDim.t + ")");

		var tip = d3.tip().attr('class', 'd3-tip').html(function(d, i) {

			return fD[i][0];
		});

		var tipCount = d3.tip().attr('class', 'd3-tip').html(function(d, i) {

			return d3.format(",")(fD[i][2]);
		});
		var tipRevenue = d3.tip().attr('class', 'd3-tip').html(function(d, i) {

			return d3.format(",")(fD[i][1]);
		});
		// create function for x-axis mapping.
		var x = d3.scale.ordinal().rangeRoundBands([ 0, hGDim.w ], 0.1).domain(
				fD.map(function(d) {
					return (d[0]);
				}));

		// Add x-axis to the histogram svg.
		hGsvg.append("g").attr("class", "x axis").data(fD).attr("transform",
				"translate(0," + hGDim.h + ")").call(
				d3.svg.axis().scale(x).orient("bottom")).selectAll("text")
				.attr('class', "xAxis-label").style("text-anchor", "end").attr(
						"dx", "-.8em").on("mouseover", tip.show).attr("dy",
						".15em").attr("transform", function(d) {
					return "rotate(-45)";
				}).on('mouseout', tip.hide).text(function(d, i) {
					return fD[i][0].substr(0, 4);
				});

		hGsvg.call(tip);

		// Create function for y-axis map.

		// Create bars for histogram to contain rectangles and freq labels.
		var bars = hGsvg.selectAll(".bar").data(fD).enter().append("g").attr(
				"class", "bar");

		// create the rectangles.
		var RevenueRect = bars.append("rect").attr("x", function(d) {
			return x(d[0]);
		}).attr("y", function(d) {
			return y(d[1]);
		}).attr("width", (x.rangeBand()) / 2).attr("height", function(d) {
			return hGDim.h - y(d[1]);
		}).attr('fill', revenueBarColor).attr("id", "revenue-rect").on(
				"mouseover", tipRevenue.show).on("mouseout", tipRevenue.hide);

		RevenueRect.call(tipRevenue);

		var countRect = bars.append("rect").data(fD).attr("x", function(d) {
			return x(d[0]);
		}).attr("y", function(d) {
			return y1(d[2]);
		}).attr("transform", function(d, i) {
			return "translate(" + (x.rangeBand() / 2) + ",0)";
		}).attr("width", (x.rangeBand()) / 2).attr("height", function(d) {
			return hGDim.h - y1(d[2]);
		}).attr('fill', countBarColor).attr("id", "count-rect").on("mouseover",
				tipCount.show).on("mouseout", tipCount.hide);
		countRect.call(tipCount);

		// mouseout is defined below.

		// bars.selectAll("rect.revenue-rect-class").on("mouseover",tipRect.show).on("mouseout",tipRect.hide);

		// bars.call(tipRect);
		// Create the frequency labels above the rectangles.
		/*
		 * bars.append("text").attr("class","bar-legend-1").text(function(d){
		 * return d3.format(",")(d[1])}).data(fD) .attr("x", function(d) {
		 * return x(d[0])+(x.rangeBand()/3); }) .attr("y", function(d) { return
		 * y(d[1])-5; }) .attr("text-anchor", "middle");
		 * 
		 * bars.append("text").attr("class","bar-legend-2").text(function(d){
		 * return d3.format(",")(d[2])}) .attr("x", function(d) { return
		 * x(d[0])+(3*(x.rangeBand()))/4; }) .attr("y", function(d) { return
		 * y1(d[2])-5; }) .attr("text-anchor", "middle");
		 */

		return hG;
	}
	// calculate total frequency by state for all segment.
	var sF = fData.map(function(d) {
		return [ d.state, d.total, d.countTotal ];
	});

	var hG = histoGram(sF);
	}

}