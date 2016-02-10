var ControlTypes = 
{
    "Button" : '<div class="motorsContainer">'+
            '<div class="header">'+
                '<span class="name"><motorname></span>'+
            '</div>'+
            '<div class="footer buttonFooter">'+
                '<span class="sliderHideButton mcButton">Hide</span>'+
                '<span class="updateButton mcButton">GO!</span>'+
            '</div>'+
        '</div>',
    "Slider" : '<div class="motorsContainer">'+
            '<div class="header">'+
                '<span class="name"><motorname></span>'+
                '<span class="value">0</span>'+
            '</div>'+
            '<div class="sliderBox">'+
                '<input class="slider" type="range" min="<minbound>" max="<maxbound>" value="0"/>'+
            '</div>'+
            '<div class="footer">'+
                '<span class="sliderHideButton mcButton">Hide</span>'+
            '</div>'+
        '</div>',
    "SliderAndButton" : '<div class="motorsContainer">'+
            '<div class="header">'+
                '<span class="name"><motorname></span>'+
                '<span class="sliderName" style="display:none;"><slidername></span>'+
                '<span class="buttonName" style="display:none;"><buttonname></span>'+
                '<span class="value">0</span>'+
            '</div>'+
            '<div class="sliderBox">'+
                '<input class="slider" type="range" min="<minbound>" max="<maxbound>" value="0"/>'+
            '</div>'+
            '<div class="footer">'+
                '<span class="sliderHideButton mcButton">Hide</span>'+
                '<span class="updateButton mcButton">GO!</span>'+
            '</div>'+
        '</div>',
    "Graph" : '<div class="sensorsContainer">'+
            '<div class="header">'+
                '<span class="name"><sensorname></span>'+
                '<span class="value">0</span>'+
            '</div>'+
            '<div class="graph" id="<idsensor>" style="width: 100%; height: 60%;"></div>'+
            '<div class="footer">'+
                '<span class="graphHideButton mcButton">Hide</span>'+
                '<span class="stopButton mcButton">Stop Graph</span>'+
            '</div>'+
        '</div>'
}

function setSliderText(evt) {
    evt.target.parentElement.parentElement.getElementsByClassName("value")[0].innerHTML =   
    evt.target.value;
}

function setValue(evt) {
    var name = $(evt.target).parent().parent().find(".buttonName").first().html();
    
    if (name == undefined)
    {
        addToDataMessage($(evt.target.parentElement.parentElement).find(".name").first().html(), "click");
    }
    else
    {
        addToDataMessage(name,
                     "click");   
    }
    
}

function attachEvents()
{
    $("#motorsPage").on("input", ".motorsContainer", setSliderText);
       
    $("#motorsPage").on("click", ".updateButton", setValue);
    
    $(".sensorsCol").on("click", ".stopButton", changeChartState);
    
    $('#showAllButton').on('click', function(){
        $('.sensorsContainer').fadeIn("slow");
        $('.motorsContainer').fadeIn("slow");
        
        $("#dropDown").slideUp(400);
        setTimeout(function() {
            $("#dropDown").css("background-color", "#F43254");
            $("#editButton").css("background-color", "#F43254");
        }, 290);
    });
    $('.graphHideButton').on('click', function(){
        $(this).parent().parent().fadeOut("slow");
    });
    $('.sliderHideButton').on('click', function(){
        $(this).parent().parent().fadeOut("slow");
    });
    
    $(".slider").on("mouseup", sendInputData);
}

/**
 * @param {HTMLType} dest location where the button should be
 * @param {string} name name of the container
 * @param {string} buttonName name of the button
 */
function addButton(dest, name, buttonName)
{
    var buttonCpy = ControlTypes["Button"].substr(0);
    buttonCpy = buttonCpy.replace("<motorname>", name);
    if (buttonName != undefined && buttonName != "")
    {
        buttonCpy = buttonCpy.replace("GO!", buttonName);
    }
    
    dest.append($(buttonCpy));
    console.log($(buttonCpy).find(".name")[0].innerHTML);
}

/**
 * @param {HTMLType} dest location where the slider should be
 * @param {string} name name of the slider
 * @param {integer} min minBound of the slider
 * @param {integer} max maxBound of the slider
 * @param {string} buttonName name of the button
 */
function addSliderAndButton(dest, name, buttonName, sliderName, min, max, nameOfButton)
{

    //doesn't work
    //var sliderHO = jQuery.parseHTML(ControlTypes["Slider"]);
    //console.log(sliderHO);
    //set name of slider
    console.log(buttonName);
    var sliderCpy = ControlTypes["SliderAndButton"].substr(0);
    sliderCpy = sliderCpy.replace("<motorname>", name);
    sliderCpy = sliderCpy.replace("<minbound>", min);
    sliderCpy = sliderCpy.replace("<maxbound>", max);
    sliderCpy = sliderCpy.replace("<slidername>", sliderName);
    sliderCpy = sliderCpy.replace("<buttonname>", buttonName);
    if (nameOfButton != undefined && nameOfButton != "")
    {
        sliderCpy = sliderCpy.replace("GO!", nameOfButton);
    }
    console.log(sliderCpy);
    console.log();
    dest.append($(sliderCpy));
    console.log($(sliderCpy).find(".name")[0].innerHTML);
    
}

/**
 * @param {HTMLType} dest location where the slider should be
 * @param {string} name name of the slider
 * @param {integer} min minBound of the slider
 * @param {integer} max maxBound of the slider
 */
function addSlider(dest, name, min, max)
{

    //doesn't work
    //var sliderHO = jQuery.parseHTML(ControlTypes["Slider"]);
    //console.log(sliderHO);
    //set name of slider
    var sliderCpy = ControlTypes["Slider"].substr(0);
    sliderCpy = sliderCpy.replace("<motorname>", name);
    sliderCpy = sliderCpy.replace("<minbound>", min);
    sliderCpy = sliderCpy.replace("<maxbound>", max);
    
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
    //TODO: initialize the graph properly and set a name
    
    var graphCpy = ControlTypes["Graph"].substr(0);
    graphCpy = graphCpy.replace("<sensorname>", name);
    var namewowhitesp = name.replace(/ /g,'');
    graphCpy = graphCpy.replace("<idsensor>", namewowhitesp);
    $(dest).append($(graphCpy));
    var chart = new MyFlotChart($("#"+namewowhitesp), maxPoints, name, min, max);
    myFlotCharts.push(chart);
}

function sendInputData(evt)
{
    console.log("adsf");
    var name = $(evt.target).parent().parent().find(".sliderName").first().html();   
    var value = $(evt.target).parent().parent().find(".value").first().html();  
    
    console.log(name);
    console.log(value);
    if (name == undefined)
    {
        addToDataMessage($(evt.target.parentElement.parentElement).find(".name").first().html(),
                         value);
    }
    else
    {
        addToDataMessage(name,
                         value);   
    }
    
}

function update(){
    myFlotCharts.forEach(function(chart){
        var value = getMIDaCValue(chart.name);
        chart.updateValues(value);
    });

}

function connect(evt) 
{
    var address = $("#hostnameInput").val(); 
    console.log(address);
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
    
    $("#motors").empty();
    $("#servos").empty();
    $(".sensorsCol").empty();
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
    
    $(document).keypress(function(e){
      if(e.keyCode==13)
      $('#connectButton').click();
    });
});

