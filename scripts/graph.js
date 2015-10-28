var myLineCharts = [];
var windowWidth = $(window).width();
function MyChart(graph) {

    this.drawing = "1";
    var that = this;
    
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
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(220,220,220,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            data: [28, 60]
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
        
        scaleShowGridLines : false,
        pointDot: false,
        datasetFill: false,
        datasetStroke : true,
        bezierCurve: false
    }
    var ctx = graph.getContext("2d");
    
    
    var myLineChart = new Chart(ctx).Line(data, options);
    
    function getRandomIntIncl(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }    

    this.updateValues = function() {
        if (that.drawing == "1")
        {
            if (xValue % 500 == 0)
            {
                myLineChart.addData([getRandomIntIncl(0, 1024)], xValue/1000+"s");
            }
            else
            {
               myLineChart.addData([getRandomIntIncl(0, 100)], ""); 
            }
            if (myLineChart.datasets[0].points.length > 100)
            {
                myLineChart.removeData();
            }
            xValue += 100; 
        }
    } 
    
    this.resize = function() {
        myLineChart.resize();   
        console.log("worked");
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
        var chart = new MyChart(graphs[i]);
        setInterval(chart.updateValues, 100); 
        myLineCharts.push(chart);
    } 
    
    var stopButtons = document.getElementsByClassName("stopButton");
    for (i = 0; i < stopButtons.length; i++) {
        stopButtons[i].addEventListener("click", changeChartState, false);
    } 
})

