
function dashboard(id, fData,width,height){
	if(fData.lenght!=0){
		
	
	
	$("#loading-img-id").hide();// hiding ajax loading image of this chart panel
    var revenueBarColor = '#9937AB';
    var countBarColor="#44B8C7";
    function segColor(c){ return {apjc:"#807dba", emea:"#e08214",americas:"#41ab5d"}[c]; }
    
    // compute total for each state.
    fData.forEach(function(d){d.total=d.freq.apjc+d.freq.emea+d.freq.americas;});
    fData.forEach(function(d){d.countTotal=d.count.apjc+d.count.emea+d.count.americas;});
    
    
    // function to handle histogram.
    function histoGram(fD){
        var hG={},    hGDim = {t: 0, r: 0, b: 30, l: 0};
        hGDim.w = width - hGDim.l - hGDim.r, 
        hGDim.h = height - hGDim.t - hGDim.b;
            
        
         var y = d3.scale.linear().range([hGDim.h, 0])
                .domain([0, d3.max(fD, function(d) { return d[1]; })]);
        var y1 = d3.scale.linear().range([hGDim.h, 0])
                .domain([0, d3.max(fD, function(d) { return d[2]; })]);
        //create svg for histogram.
        var hGsvg = d3.select("#histogram").append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");
        
    	var tip = d3.tip().attr('class', 'd3-tip').html(function(d, i) {

			return fD[i][0];
		});

        // create function for x-axis mapping.
        var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                .domain(fD.map(function(d) { return d[0]; }));

        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "x axis").data(fD)
            .attr("transform", "translate(0," + hGDim.h + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"))
            .selectAll("text")
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
        var bars = hGsvg.selectAll(".bar").data(fD).enter()
                .append("g").attr("class", "bar");
        
        console.log(x.rangeBand());
        //create the rectangles.
       var RevenueRect= bars.append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("width", (x.rangeBand())/2)
            .attr("height", function(d) { return hGDim.h - y(d[1]); })
            .attr('fill',revenueBarColor).attr("id","revenue-rect")
            .on("mouseover",mouseoverRevenue)// mouseover is defined beAPJC.
            .on("mouseout",mouseoutRevenue);
        
        var countRect= bars.append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y1(d[2]); })
            .attr("transform", function(d, i) {
                return "translate(" + (x.rangeBand()/2) + ",0)";})
            .attr("width", (x.rangeBand())/2)
            .attr("height", function(d) { return hGDim.h - y1(d[2]); })
            .attr('fill',countBarColor).attr("id","count-rect")
            .on("mouseover",mouseoverCount)// mouseover is defined beAPJC.
            .on("mouseout",mouseoutCount);
        // mouseout is defined beAPJC.
            
        //Create the frequency labels above the rectangles.
        bars.append("text").attr("class","bar-legend-1").text(function(d){ return d3.format(",")(d[1])})
            .attr("x", function(d) { return x(d[0])-5; })
            .attr("y", function(d) { return y(d[1])-5; })
            .attr("text-anchor", "EMEAdle");
        
        bars.append("text").attr("class","bar-legend-2").text(function(d){ return d3.format(",")(d[2])})
            .attr("x", function(d) { return x(d[0])+10; })
            .attr("y", function(d) { return y1(d[2])-5; })
            .attr("text-anchor", "EMEAdle");
        
        function mouseoverRevenue(d){  // utility function to be called on mouseover.
            // filter for selected state.
            console.log(d);
            var st = fData.filter(function(s){ return s.state == d[0];})[0],
                nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});
               
            // call update functions of pie-chart and legend.    
            pC.update(nD);
            leg.update(nD,"Revenue");
        }
        function mouseoverCount(d){  // utility function to be called on mouseover.
            // filter for selected state.
            console.log(d);
            var st = fData.filter(function(s){ return s.state == d[0];})[0],
                nD = d3.keys(st.count).map(function(s){ return {type:s, freq:st.count[s]};});
               
            // call update functions of pie-chart and legend.    
            pC.update(nD);
            leg.update(nD,"Count");
        }
        
        
        
        
        function mouseoutRevenue(d){    // utility function to be called on mouseout.
            // reset the pie-chart and legend.    
            pC.update(tF);
            leg.update(tF,"Total-Revenue");
        }
        function mouseoutCount(d){    // utility function to be called on mouseout.
            // reset the pie-chart and legend.    
            pC.update(tC);
            leg.update(tC,"Total-Count");
        }
        
        // create function to update the bars. This will be used by pie-chart.
        hG.update = function(nD, color){
            // update the domain of the y-axis map to reflect change in frequencies.
            y.domain([0, d3.max(nD, function(d) { return d[1]; })]);
            y1.domain([0, d3.max(nD, function(d) { return d[2]; })]);
            
            // Attach the new data to the bars.
            var bars = hGsvg.selectAll(".bar").data(nD);
            
            // transition the height and color of rectangles.
            bars.select("rect#revenue-rect").transition().duration(500)
                .attr("y", function(d) {return y(d[1]); })
                .attr("height", function(d) { return hGDim.h - y(d[1]); })
                .attr("fill", color);

            // transition the frequency labels location and change value.
            bars.select("text").transition().duration(500)
                .text(function(d){ return d3.format(",")(d[1])})
                .attr("y", function(d) {return y(d[1])-5; });   
            
            bars.select("rect#count-rect").transition().duration(500)
            .attr("y", function(d) {return y1(d[2]); })
            .attr("height", function(d) { return hGDim.h - y1(d[2]); });
            

        // transition the frequency labels location and change value.
            bars.select("text.bar-legend-1").transition().duration(500)
            .text(function(d){ return d3.format(",")(d[1])})
            .attr("y", function(d) {return y(d[1])-5; });
            
            bars.select("text.bar-legend-2").transition().duration(500)
            .text(function(d){ return d3.format(",")(d[2])})
            .attr("y", function(d) {return y1(d[2])-5; });   
            
         /*   bars.select("text").transition().duration(500)
            .text(function(d){ return d3.format(",")(d[1])})
            .attr("y", function(d) {return y(d[2])-5; });   */
            
            
            
        
            
          /*  y.domain([0, d3.max(nD, function(d) { return d[2]; })]);
            
            // Attach the new data to the bars.
            var bars = hGsvg.selectAll(".bar").data(nD);
            
            // transition the height and color of rectangles.
            bars.select("rect#count-rect").transition().duration(500)
                .attr("y", function(d) {return y(d[2]); })
                .attr("height", function(d) { return hGDim.h - y(d[2]); })
                .attr("fill", color);

            // transition the frequency labels location and change value.
            bars.select("text").transition().duration(500)
                .text(function(d){ return d3.format(",")(d[2])})
                .attr("y", function(d) {return y(d[2])-5; });   */
        }        
        return hG;
    }
    
    // function to handle pieChart.
    function pieChart(pD){
        var pC ={},    pieDim ={w:(width*2)/3, h: (height*2)/3};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;
                
        // create svg for pie chart.
        var piesvg = d3.select("#piechart").append("svg")
            .attr("width", pieDim.w).attr("height", pieDim.h).style("margin-left",function(){
            	return width<400?"0px":"0px";
            	
            }).append("g")
            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");
        
        // create function to draw the arcs of the pie slices.
        var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

        // create a function to compute the pie slice angles.
        var pie = d3.layout.pie().sort(null).value(function(d) { return d.freq; });

        // Draw the pie slices.
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d) { return segColor(d.data.type); })
            .on("mouseover",mouseover).on("mouseout",mouseout);

        // create function to update pie-chart. This will be used by histogram.
        pC.update = function(nD){
            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        }        
        // Utility function to be called on mouseover a pie slice.
        function mouseover(d,s){
        	console.log(" call the update function of histogram with new data.");
            console.log(s);
            // call the update function of histogram with new data.
            hG.update(fData.map(function(v){ 
                return [v.state,v.freq[d.data.type],v.count[d.data.type]];}),segColor(d.data.type));
            
        }
        //Utility function to be called on mouseout a pie slice.
        function mouseout(d){
            // call the update function of histogram with all data.
            hG.update(fData.map(function(v){
                return [v.state,v.total,v.countTotal];}), revenueBarColor);
        }
        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }    
        return pC;
    }
    
    // function to handle legend.
    function legend(lD,text){
    	var fontSize
    	if($(window).width()/4<120){
    		 fontSize="10px";
    	}
    	else{
    		fontSize="14px";
    	}
        var leg = {};
            
        // create table for legend.
        var laegnd=d3.select(id).append("div").text(text).attr("id","table-heading");
        var legend = d3.select("#piechartTable").append("table").attr('class','legend').style("margin-left",function(){
        	return ("0px");
        });
        
        // create one row per segment.
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");
            
        // create the first column for each segment.
        tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
            .attr("width", '16').attr("height", '16')
			.attr("fill",function(d){ return segColor(d.type); });
            
        // create the second column for each segment.
        tr.append("td").text(function(d){ return (d.type).toUpperCase();}).style("font-size",fontSize);;

        // create the third column for each segment.
        tr.append("td").attr("class",'legendFreq')
            .text(function(d){ return d3.format(",")(d.freq);}).style("font-size",fontSize);;

        // create the fourth column for each segment.
        tr.append("td").attr("class",'legendPerc')
            .text(function(d){ return getLegend(d,lD);}).style("font-size",fontSize);

        // Utility function to be used to update the legend.
        leg.update = function(nD,text){
            // update the data attached to the row elements.
          var laegnd=d3.select("#table-heading").text(text);
            var l = legend.select("tbody").selectAll("tr").data(nD);

            // update the frequencies.
            l.select(".legendFreq").text(function(d){ return d3.format(",")(d.freq);}).style("font-size",fontSize);;

            // update the percentage column.
            l.select(".legendPerc").text(function(d){ return getLegend(d,nD);}).style("font-size",fontSize);;        
        }
        
        function getLegend(d,aD){ // Utility function to compute percentage.
            return d3.format("%")(d.freq/d3.sum(aD.map(function(v){ return v.freq; })));
        }

        return leg;
    }
    
    // calculate total frequency by segment for all state.
    var tF = ['apjc','emea','americas'].map(function(d){ 
        return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];})),count: d3.sum(fData.map(function(t){ return t.count[d];}))}; 
    });    
    
      var tC = ['apjc','emea','americas'].map(function(d){ 
        return {type:d, freq: d3.sum(fData.map(function(t){ return t.count[d];}))}; 
    });
    // calculate total frequency by state for all segment.
    var sF = fData.map(function(d){return [d.state,d.total,d.countTotal];});

    var  pC = pieChart(tF),// create the pie-chart.
        leg= legend(tF,"Total-Revenue"),  // create the legend.
        hG = histoGram(sF);// create the histogram.
	}
}
