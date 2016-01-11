function setSliderText(evt) {
    evt.target.parentElement.parentElement.getElementsByClassName("value")[0].innerHTML = evt.target.value;
}

function setValue(evt) {
    //save value at an appropriate location
    alert(evt.target.parentElement.parentElement.getElementsByTagName("input")[0].value);
    //evt.target.parentElement.parentElement.getElementsByClassName("value")[0].innerHTML = evt.target.value;
}

function connect(evt) {
    var address = $("#hostnameInput").val; 
    setupConnection(address);
    
}

function changeToSerAndMotPage()
{
    $(".navFont").each(function(){this.style.display = 'block';});
    
    document.getElementById("loginPage").style.display = 'none';
    document.getElementById("sensorsPage").style.visibility = 'hidden';
    document.getElementById("motorsPage").style.display = 'block';
}

function changeToSensorsPage()
{
    $(".navFont").each(function(){this.style.display = 'block';});
    
    document.getElementById("loginPage").style.display = 'none';
    document.getElementById("sensorsPage").style.visibility = 'visible';
    document.getElementById("motorsPage").style.display = 'none';
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
    
    var servos = document.getElementsByClassName("servosContainer");
    for (i = 0; i < servos.length; i++) {
        servos[i].addEventListener("input", setSliderText, false);
    }
    
    var motors = document.getElementsByClassName("motorsContainer");
    for (i = 0; i < motors.length; i++) {
        motors[i].addEventListener("input", setSliderText, false);
    }
    
    var updateButtons = document.getElementsByClassName("updateButton");
    for (i = 0; i < updateButtons.length; i++) {
        updateButtons[i].addEventListener("click", setValue, false);
    }
    document.getElementById("connectButton").addEventListener("click", connect, false);
});

