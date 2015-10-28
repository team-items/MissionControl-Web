function setupChart(graph)
{
    var windowWidth = screen.width;
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
        animation: false,
        scaleOverride: true,
        
        scaleSteps: 5,
        scaleStepWidth: 20,
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

    function updateValues() {
        
        if (screen.width != windowWidth)
        {
            myLineChart.resize();
        }

        if (xValue % 500 == 0)
        {
            myLineChart.addData([getRandomIntIncl(0, 100)], xValue/1000+"s"); 
        }
        else
        {
           myLineChart.addData([getRandomIntIncl(0, 100)], ""); 
        }
        if (myLineChart.datasets[0].points.length > 10)
        {
            myLineChart.removeData();
        }
        xValue += 100;        
    }
    
    
    
    setInterval(updateValues, 100);        
    
}

$(document).ready(function (){
    
    var graphs = document.getElementsByClassName("graph");
    for (i = 0; i < graphs.length; i++) {
        graphs[i].addEventListener(setupChart(graphs[i]), false);
    } 
})

