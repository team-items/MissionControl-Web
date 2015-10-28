function setupGraph(graph)
{
      var chart = new CanvasJS.Chart(graph, { 
        zoomEnabled: false,
        backgroundColor: "rgba(0,0,0,0.0)",
        axisY:{
        gridThickness: 0
      },
		data: [
		{
            markerSize: 0,
            color: "#F43254",
			type: "line",
			dataPoints: [
				{ y:  10 },
                
			]
		}
		]
	});
	chart.render();	
    var dps = chart.options.data[0].dataPoints;
    
    var xVal = 0;
    var yVal = 15;	
    var updateInterval = 100;
    
    function getRandomIntIncl(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
	function draw() {

        var length = chart.options.data[0].dataPoints.length;
        
        
        yVal = getRandomIntIncl(0, 100);
        if (xVal % 500 == 0)
        {
            dps.push({x: Math.floor(xVal),y: yVal});
        }
        else
        {
            dps.push({x: Math.floor(xVal),y: yVal});   
        }
      	
      	xVal += updateInterval;
        
        if (length >  10)
        {
        chart.options.data[0].dataPoints.shift();				
        }
        chart.render();

	};
    setInterval(draw, updateInterval);  
}
    
window.onload = function () {
    
	var graphs = document.getElementsByClassName("graphCanvasJS");
    for (i = 0; i < graphs.length; i++) {
        setupGraph(graphs[i]);
    } 
}