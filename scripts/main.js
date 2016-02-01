var ControlTypes = 
{
    "Button" : '',
    "Slider" : '<div class="motorsContainer">'+
            '<div class="header">'+
                '<span class="name"><motorname></span>'+
                '<span class="value">0</span>'+
            '</div>'+
            '<div class="sliderBox">'+
                '<input type="range" min="0" max="2048" value="0"/>'+
            '</div>'+
            '<div class="footer">'+
                '<span class="updateButton">Set Value</span>'+
            '</div>'+
        '</div>',
    "Graph" : '<div class="sensorsContainer">'+
            '<div class="header">'+
                '<span class="name"><sensorname></span>'+
                '<span class="value">0</span>'+
            '</div>'+
            '<div class="graph" style="width: 100%; height: 60%;"></div>'+
            '<div class="footer">'+
                '<span class="stopButton">Continue Graph</span>'+
            '</div>'+
        '</div>'
}

function setSliderText(evt) {
    evt.target.parentElement.parentElement.getElementsByClassName("value")[0].innerHTML =   
    evt.target.value;
}

function setValue(evt) {
    //save value at an appropriate location
    alert(evt.target.parentElement.parentElement.getElementsByTagName("input")[0].value);
    //evt.target.parentElement.parentElement.getElementsByClassName("value")[0].innerHTML = evt.target.value;
}

function attachEvents()
{
    var sliders = document.getElementsByClassName("motorsContainer");
    for (var i = 0; i < sliders.length; i++) {
        sliders[i].addEventListener("input", setSliderText, false);
    }   
    
    var updateButtons = document.getElementsByClassName("updateButton");
    for (var i = 0; i < updateButtons.length; i++) {
        updateButtons[i].addEventListener("click", setValue, false);
    }
}

/**
 * @param {HTMLType} dest location where the button should be
 * @param {string} name name of the button
 */
function addButton(dest, name)
{
    console.log(typeof(dest));
    
    dest.append(ControlTypes["Button"]);
}

/**
 * @param {HTMLType} dest location where the slider should be
 * @param {string} name name of the slider
 * @param {integer} min minBound of the slider
 * @param {integer} max maxBound of the slider
 */
function addSlider(dest, name, min, max)
{
    console.log(typeof(dest));

    //doesn't work
    //var sliderHO = jQuery.parseHTML(ControlTypes["Slider"]);
    //console.log(sliderHO);
    //set name of slider
    var sliderCpy = ControlTypes["Slider"].substr(0);
    sliderCpy = sliderCpy.replace("<motorname>", name);
    
    dest.append($(sliderCpy));
    console.log($(sliderCpy).find(".name")[0].innerHTML);
}

/**
 * @param {HTMLType} dest location where the graph should be
 * @param {string} name name of the graph
 * @param {integer} maxPoints maximum Points the graph displays
 */
function addGraph(dest, maxPoints, name, min, max)
{
    console.log(typeof(dest));
   
    //TODO: initialize the graph properly and set a name
    //set name of graph
    
    var graphCpy = ControlTypes["Graph"].substr(0);
    graphCpy = graphCpy.replace("<sensorname>", name);

    $(dest).append($(graphCpy));
    var chart = new MyFlotChart($(graphCpy).find(".graph").first(), maxPoints, name, min, max);
    myFlotCharts.push(chart);
    
    console.log("graph creation worked fine");
}

function addStopButtonEvent()
{
    $(".sensorsCol").on("click", ".stopButton", changeChartState);   
}

function connect(evt) 
{
    var address = $("#hostnameInput").val; 
    setupConnection(address);
}

function changeToSerAndMotPage()
{
    
    $(".navFont").each(function(){this.style.display = 'block';});
    
    document.getElementById("loginPage").style.display = 'none';
    document.getElementById("sensorsPage").style.visibility = 'hidden';
    document.getElementById("motorsPage").style.display = 'block';
    
    $("#dropDown").hide();
}

function changeToSensorsPage()
{
    
    $(".navFont").each(function(){this.style.display = 'block';});
    
    document.getElementById("loginPage").style.display = 'none';
    document.getElementById("sensorsPage").style.visibility = 'visible';
    document.getElementById("motorsPage").style.display = 'none';
    
    $("#dropDown").hide();
}

function changeToLoginPage()
{
    var menuItems = $(".navFont");
    $(".navFont").each(function(){this.style.display = 'none';});
    
    document.getElementById("loginPage").style.display = 'block';
    document.getElementById("sensorsPage").style.visibility = 'hidden';
    document.getElementById("motorsPage").style.display = 'none';
}

$("#editButton").click(function(){
    //$("#dropDown").slideToggle(400);
    console.log($("#dropDown").is(":hidden"));
    if($("#dropDown").is(":hidden"))
    {
        $("#dropDown").slideDown(400);
        setTimeout(function() {
            $("#dropDown").css("background-color", "#de2b4a");
            $("#editButton").css("background-color", "#de2b4a");
        }, 140);
    }     
    else
    {
        $("#dropDown").slideUp(400);
        setTimeout(function() {
            $("#dropDown").css("background-color", "#F43254");
            $("#editButton").css("background-color", "#F43254");
        }, 290);
    }
});

$(document).ready(function(){
    $("#dropDown").hide();
    
    var buttons = document.getElementsByClassName("listElement");
    buttons[0].addEventListener("click", function(){
                                    changeToLoginPage();
    });
    buttons[1].addEventListener("click", function(){
                                    changeToSerAndMotPage();
    });
    buttons[2].addEventListener("click", function(){
                                    changeToSensorsPage();
    }); 
    document.getElementById("logoutButton").addEventListener("click", function(){
                                    changeToLoginPage();
    }); 
    document.getElementById("connectButton").addEventListener("click", connect, false);
});

