var myFlotCharts = [];
var windowWidth = $(window).width();

function getRandomIntIncl(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 

function MyFlotChart(dest, maxGraphPoints, graphName, minBound, maxBound) 
{

    // We use an inline data source in the example, usually data would
    // be fetched from a server
    this.name = graphName;
    this.drawing = "0";
    this.maxPoints = maxGraphPoints;
    this.data = [];
    this.xValue = 0;

    var that = this;

    // Set up the control widget
    for	(var i = 0; i < that.maxPoints; i++) {
        that.data.push([i, 0]);
    }
    console.log(that.data);
    this.updateInterval = 100;
    
    var rand = [that.xValue, getRandomIntIncl(minBound, maxBound)];
    that.data[that.xValue] = rand;
    this.plot = $.plot(dest, that.data,  {
        series: {
            shadowSize: 0,	// Drawing is faster without shadows
        },
        yaxis: {
            min: minBound,
            max: maxBound,
        },
        xaxis: {
            show: false,
        },
        grid : {
            borderWidth: {
                top: 0,
                right: 0,
                bottom: 1,
                left: 1
            },
            clickable: true
        }
    });
    that.xValue++;
    this.resize = function() {
        that.plot.resize();  
        that.plot.setupGrid();
        that.plot.draw();
        console.log("resizing graph of " + that.name + " worked");
    }

    this.updateValues = function() {
        if (that.drawing == "1")
        {
            rand = [that.xValue, getRandomIntIncl(minBound, maxBound)];
            that.data[that.xValue] = rand;
            that.xValue++;
            that.plot.setData(that.data);
            
            if (that.name == 'analog 0')
            {
                console.log(that.name + ' : ' + that.data[that.xValue-1] + ' : ' + (that.xValue-1));
            }
            // Since the axes don't change, we don't need to call plot.setupGrid()

            that.plot.draw();
            
            if (that.xValue > that.maxPoints)
            {
                that.xValue = 0;
            }
            
        }
        
    }
    setInterval(that.updateValues, that.updateInterval);

}

function changeChartState(evt)
{
    console.log("in change graph state");
    var button = evt.target;
    var currGraph = button.parentElement.parentElement.getElementsByClassName("graph")[0];
    var index;
    var graphs = document.getElementsByClassName("graph");
    
    for (var i = 0; i < graphs.length; i++) {
        if (graphs[i] == currGraph)
        {
            index = i;
        }
    }
    if (button.innerHTML == "Stop Graph")
    {
        myFlotCharts[index].drawing = "0";
        button.innerHTML = "Continue Graph";
    }
    else 
    {
        myFlotCharts[index].drawing = "1";
        button.innerHTML = "Stop Graph";
    }    
}

$(window).resize(function(){
   for (var i = 0; i < myFlotCharts.length; i++) {
        myFlotCharts[i].resize();   
   }
});

$(document).ready(function (){
    
    for (var i = 0; i < 2; i++) {
        
        addGraph($("#sensorsCol1"), 20, "analog "+i, 0, 1024);
        console.log(i);
        
    } 

})