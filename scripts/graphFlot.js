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

    this.updateInterval = 100;

    var plot = $.plot(dest, that.data.push([that.xValue, getRandomIntIncl(minBound, maxBound)]),     {
        series: {
            shadowSize: 0,	// Drawing is faster without shadows
            bars: {
                show: false
            }
        },
        yaxis: {
            min: minBound,
            max: maxBound,
            tickLength: 0
        },
        xaxis: {
            show: false,
            tickLength: 0
        },
        grid : {
            borderWidth: {
                top: 0,
                right: 0,
                bottom: 1,
                left: 1
            }
        }
    });
    
    this.resize = function() {
        plot.resize();  
        plot.setupGrid();
        plot.draw();
        console.log("resizing graph of " + that.name + " worked");
    }

    this.updateValues = function() {
        if (that.drawing == "1")
        {
            plot.setData(that.data.push([++that.xValue, getRandomIntIncl(minBound, maxBound)]));

            // Since the axes don't change, we don't need to call plot.setupGrid()

            plot.draw();
            
        }
    }

    setInterval(that.updateValues, that.updateInterval);

}

function changeChartState(evt)
{
    console.log("gruezii" + evt.target);
    var button = evt.target;
    var currGraph = button.parentElement.parentElement.getElementsByClassName("graph")[0];
    var index;
    var graphs = document.getElementsByClassName("graph");
    for (i = 0; i < graphs.length; i++) {
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
   for (i = 0; i < myFlotCharts.length; i++) {
        myFlotCharts[i].resize();   
   }
});

$(document).ready(function (){
    
    var graphs = document.getElementsByClassName("graph");
    for (i = 0; i < graphs.length; i++) {
        var chart = new MyFlotChart(graphs[i], 20, "analog"+i, 0, 1024);
        myFlotCharts.push(chart);
    } 
    
    var stopButtons = document.getElementsByClassName("stopButton");
    for (i = 0; i < stopButtons.length; i++) {
        $(stopButtons[i]).click(changeChartState);
    } 
})