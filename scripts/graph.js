var myLineCharts = [];
var windowWidth = $(window).width();
function MyChart(graph, maxGraphPoints, graphName) {

    this.name = graphName;
    this.drawing = "0";
    this.maxPoints = maxGraphPoints;
    
    
    var xValue = 1000;
    
    var data = {
        labels : ["","","","","","","","","",""],
        datasets : [
        {
            label: "My Second dataset",
            fill: false,
            backgroundColor: "white",
            strokeColor: "#F43254",
            borderColor: "rgba(220,220,220,1)",
            pointBorderColor: "rgba(220,220,220,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
        }
        ]
    }
    var options = {
        responsive: true,
        maintainAspectRatio: true,
        animation: false,
        scaleOverride: true,
        
        scaleSteps: 2,
        scaleStepWidth: 512,
        scaleStartValue: 0,
        
        tooltipEvents: ["click"],
        
        scaleShowGridLines : false,
        pointDot: false,
        datasetFill: false,
        datasetStroke : true,
        bezierCurve: false
    }
    var that = this;
    
    var ctx = graph.getContext("2d");
    var myLineChart = new Chart(ctx).Line(data, options);
    
    function getRandomIntIncl(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }    

    this.updateValues = function() {
        if (that.drawing == "1")
        {
            myLineChart.addData(getMIDaCValue(that.name)); 
            
            if (myLineChart.datasets[0].points.length > that.maxPoints)
            {
                myLineChart.removeData();
            }
            xValue += 100; 
        }
    } 
    
    this.resize = function() {
        myLineChart.resize();   
        console.log("resizing graph of " + that.name + " worked");
    }
}



function changeChartState(evt)
{
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
        myLineCharts[index].drawing = "0";
        button.innerHTML = "Continue Graph";
    }
    else 
    {
        myLineCharts[index].drawing = "1";
        button.innerHTML = "Stop Graph";
    }    
}

/*$(window).resize(function(){
   for (i = 0; i < myLineCharts.length; i++) {
        myLineCharts[i].resize();   
   }
});*/

$(document).ready(function (){
    
    var graphs = document.getElementsByClassName("graph");
    for (i = 0; i < graphs.length; i++) {
        var chart = new MyChart(graphs[i], 20, "analog"+i);
        setInterval(chart.updateValues, 100); 
        myLineCharts.push(chart);
    } 
    
    var stopButtons = document.getElementsByClassName("stopButton");
    for (i = 0; i < stopButtons.length; i++) {
        stopButtons[i].addEventListener("click", changeChartState, false);
    } 
})

