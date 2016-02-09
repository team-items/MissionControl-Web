var myFlotCharts = [];
var windowWidth = $(window).width();

function getRandomIntIncl(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 

function setGraphValue(name, value)
{
    var idwowhitesp = "#"+ name.replace(/ /g,'');
    $(idwowhitesp).prev().find(".value").html(value);
}

function MyFlotChart(dest, maxGraphPoints, graphName, minBound, maxBound) 
{

    // We use an inline data source in the example, usually data would
    // be fetched from a server
    this.name = graphName;
    this.drawing = "1";
    this.maxPoints = maxGraphPoints;
    this.data = [],
            totalPoints = 300;
    this.xValue = 0;

    var that = this;


    this.getRandomData =function (value) {
            
            if (that.data.length > 0)
                that.data = that.data.slice(1);

            // Do a random walk

            while (that.data.length < that.maxPoints) {

                var prev = that.data.length > 0 ? that.data[that.data.length - 1] : 50,
                    y = value
                that.data.push(y);
            }

            // Zip the generated y values with the x values

            var res = [];
            for (var i = 0; i < that.data.length; ++i) {
                res.push([i, that.data[i]])
            }

            return res;
        }
    
    for	(var i = 0; i < that.maxPoints; i++) {
        //that.data.push([i, 500]);
    }
    this.updateInterval = 100;
    
    this.plot = $.plot(dest, [ that.getRandomData() ],  {
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
            clickable: false,
            hoverable: true
        },
        colors: ["#F43254"]
    });
    that.xValue++;
    this.resize = function() {
        //that.plot.resize();  
        //that.plot.setupGrid();
        that.plot.draw();
        console.log("resizing graph of " + that.name + " worked");
    }

    this.updateValues = function(value) {
        if (that.drawing == "1")
        {   

            setGraphValue(that.name, value);
            if(value === "true"){
                value = 1;
            }
            else if(value === "false"){
                value = 0;
            }
            that.plot.setData([ that.getRandomData(value) ]);
            //console.log(that.name + ' : ' + that.data[that.xValue-1] + ' : ' + (that.xValue-1));   
            // Since the axes don't change, we don't need to call plot.setupGrid()

            that.plot.draw();


        }
        //setTimeout(that.updateValues, that.updateInterval);
    }
    
    $(dest).bind("plothover", function (event, pos, item) 
    {
        if (item) {
            var y = item.datapoint[1].toFixed(0);

            setGraphValue(that.name, y);
        }
    });
    //that.updateValues();
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