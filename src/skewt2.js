/**
 * SkewT v1.1.0
 * 2016 David Félix - dfelix@live.com.pt
 * 
 * Dependency:
 * d3.v3.min.js from https://d3js.org/
 * 
 */
var SkewT2 = function(div) {
    //properties used in calculations
    var wrapper = d3.select(div);
    var width = parseInt(wrapper.style('width'), 10);
    var height = width; //tofix
    var margin = {top: 30, right: 40, bottom: 20, left: 35}; //container margins
    var deg2rad = (Math.PI/180);
    var tan = Math.tan(55*deg2rad);
    var baseh = 0;
    var toph = 10000;
    var hlines = [1000,2000,3000,4000,5000,6000,7000,8000,9000,10000];
    var hticks = [500,1500,2500,3500,4500,5500,6500,7500,8500,9500];
    var barbsize = 25;
    // functions for Scales and axes. Note the inverted domain for the y-scale: bigger is up!
    var r = d3.scaleLinear().range([0,300]).domain([0,150]);
    var y2 = d3.scaleLinear();
    var bisectTemp = d3.bisector(function(d) { return d.hgt; }).left; // bisector function for tooltips
    var w, h, x, y, xAxis, yAxis, yAxis2;
    var data = [];
    //aux
    var unit = "kt"; // or kmh

    //containers
    var svg = wrapper.append("svg").attr("id", "svg");   //main svg
    var container = svg.append("g").attr("id", "container"); //container 
    var skewtbg = container.append("g").attr("id", "skewtbg").attr("class", "skewtbg");//background
    var skewtgroup = container.append("g").attr("class", "skewt"); // put skewt lines in this group
    var barbgroup  = container.append("g").attr("class", "windbarb"); // put barbs in this group    
    
    //local functions   
    function setVariables() {
        width = parseInt(wrapper.style('width'), 10) - 10; // tofix: using -10 to prevent x overflow
        height = width; //to fix
        w = width - margin.left - margin.right;
        h = height - margin.top - margin.bottom;     
        x = d3.scaleLinear().range([0, w]).domain([-50,50]);
        y = d3.scaleLinear().range([0, h]).domain([toph, baseh]);
        xAxis = d3.axisBottom(x).tickSize(0,0).ticks(10);
        yAxis = d3.axisRight(y).tickSize(0,0).tickValues(hlines).tickFormat(d3.format(".0d"));
        //yAxis2 = d3.axisRight(y).tickSize(5,0).tickValues(pticks);
    }
    
    function convert(msvalue, unit)
    {
        switch(unit) {
            case "kt":
                return msvalue*1.943844492;
            break;
            case "kmh":
                return msvalue*3.6;
            break;
            default:
                return msvalue;
        }       
    }

    //assigns d3 events
    //d3.select(window).on('resize', resize); 

    function resize() {
        skewtbg.selectAll("*").remove(); 
        setVariables();
        svg.attr("width", w + margin.right + margin.left).attr("height", h + margin.top + margin.bottom);               
        container.attr("transform", "translate(" + margin.left + "," + margin.top + ")");       
        drawBackground();
        makeBarbTemplates();
        plot(data);
    }
    
    var drawBackground = function() {
        // Add clipping path
        skewtbg.append("clipPath")
        .attr("id", "clipper")
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", w)
        .attr("height", h);

        // Skewed temperature lines
        skewtbg.selectAll("templine")
        .data(d3.range(-100,45,10))
        .enter().append("line")
        .attr("x1", function(d) { return x(d)-0.5 + (y(baseh)-y(toph))/tan; })
        .attr("x2", function(d) { return x(d)-0.5; })
        .attr("y1", 0)
        .attr("y2", h)
        .attr("class", function(d) { if (d == 0) { return "tempzero"; } else { return "gridline"}})
        .attr("clip-path", "url(#clipper)");
        //.attr("transform", "translate(0," + h + ") skewX(-30)");
        
        // Height lines
        skewtbg.selectAll("heightline")
        .data(hlines)
        .enter().append("line")
        .attr("x1", 0)
        .attr("x2", w)
        .attr("y1", function(d) { return y(d); })
        .attr("y2", function(d) { return y(d); })
        .attr("class", "gridline");

        // Line along right edge of plot
        skewtbg.append("line")
        .attr("x1", w-0.5)
        .attr("x2", w-0.5)
        .attr("y1", 0)
        .attr("y2", h)
        .attr("class", "gridline");

        // Add axes
        skewtbg.append("g").attr("class", "x axis").attr("transform", "translate(0," + (h-0.5) + ")").call(xAxis);
        skewtbg.append("g").attr("class", "y axis").attr("transform", "translate(-0.5,0)").call(yAxis);
        //skewtbg.append("g").attr("class", "y axis ticks").attr("transform", "translate(-0.5,0)").call(yAxis2);      
    }
    
    var makeBarbTemplates = function(){
        var speeds = d3.range(0,300,5);
        var barbdef = container.append('defs')
        speeds.forEach(function(d) {
            var thisbarb = barbdef.append('g').attr('id', 'barb'+d);
            var flags = Math.floor(d/50);
            var pennants = Math.floor((d - flags*50)/10);
            var halfpennants = Math.floor((d - flags*50 - pennants*10)/5);
            var px = barbsize;
            // Draw wind barb stems
            thisbarb.append("line").attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", barbsize);
            // Draw wind barb flags and pennants for each stem
            for (var i=0; i<flags; i++) {
                thisbarb.append("polyline")
                    .attr("points", "0,"+px+" -10,"+(px)+" 0,"+(px-4))
                    .attr("class", "flag");
                px -= 7;
            }
            // Draw pennants on each barb
            for (i=0; i<pennants; i++) {
                thisbarb.append("line")
                    .attr("x1", 0)
                    .attr("x2", -10)
                    .attr("y1", px)
                    .attr("y2", px+4)
                px -= 3;
            }
            // Draw half-pennants on each barb
            for (i=0; i<halfpennants; i++) {
                thisbarb.append("line")
                    .attr("x1", 0)
                    .attr("x2", -5)
                    .attr("y1", px)
                    .attr("y2", px+2)
                px -= 3;
            }
        });     
    }
       
    var plot = function(s){     
        data = s;
        skewtgroup.selectAll("path").remove(); //clear previous paths from skew
        barbgroup.selectAll("use").remove(); //clear previous paths from barbs   

        //skew-t stuff
        var skewtline = data.filter(function(d) { return (d.ta > -999); });
        var skewtlines = [];
        skewtlines.push(skewtline);
        
        var templine = d3.line().x(function(d,i) { return x(d.ta) + (y(baseh)-y(d.hgt))/tan; }).y(function(d,i) { return y(d.hgt); });
        var tempLines = skewtgroup.selectAll("templines")
            .data(skewtlines).enter().append("path")
            .attr("class", function(d,i) { return (i<10) ? "temp skline" : "temp mean" })
            .attr("clip-path", "url(#clipper)")
            .attr("d", templine);

        //var tempdewline = d3.line().x(function(d,i) { return x(d.td) + (y(baseh)-y(d.hgt))/tan; }).y(function(d,i) { return y(d.hgt); });
        //var tempDewlines = skewtgroup.selectAll("tempdewlines")
        //    .data(skewtlines).enter().append("path")
        //    .attr("class", function(d,i) { return (i<10) ? "dwpt skline" : "dwpt mean" })
        //    .attr("clip-path", "url(#clipper)")
        //    .attr("d", tempdewline);

        //barbs stuff
        var barbs = data.filter(function(d) { return (parseFloat(d.wsd) > 0 && d.hgt <= toph); });
        var allbarbs = barbgroup.selectAll("barbs")
            .data(barbs).enter().append("use")
            .attr("xlink:href", function (d) { return "#barb"+Math.round(convert(d.wsd, "kt")/5)*5; }) // 0,5,10,15,... always in kt
            .attr("transform", function(d,i) { return "translate("+(w)+","+y(d.hgt)+") rotate("+(d.vec-180)+")"; });           

        //mouse over
        //drawToolTips(skewtlines[0]);
    }

    var clear = function(s){
        skewtgroup.selectAll("path").remove(); //clear previous paths from skew
        barbgroup.selectAll("use").remove(); //clear previous paths  from barbs
        //must clear tooltips!
        container.append("rect")
            .attr("class", "overlay")
            .attr("width", w)
            .attr("height", h)
            .on("mouseover", function(){ return false;})
            .on("mouseout", function() { return false;})
            .on("mousemove",function() { return false;});
    }
    
    //assings functions as public methods
    this.drawBackground = drawBackground;
    this.plot = plot;
    this.clear = clear;
    
    //init 
    setVariables();
    resize();
};

