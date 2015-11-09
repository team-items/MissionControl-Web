function setSliderText(evt) {
    evt.target.parentElement.parentElement.getElementsByClassName("value")[0].innerHTML = evt.target.value;
}

function setValue(evt) {
    //save value at an appropriate location
    alert(evt.target.parentElement.parentElement.getElementsByTagName("input")[0].value);
    //evt.target.parentElement.parentElement.getElementsByClassName("value")[0].innerHTML = evt.target.value;
}

function connect(evt) {
    alert("Connecting...");   
}

function init()
{
    
}

init();

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
        }, 360);
    }
});

$(document).ready(function(){
    $("#dropDown").hide();
    
    var buttons = document.getElementsByClassName("listElement");
    buttons[0].addEventListener("click", function(){
                                    document.getElementById("loginPage").style.visibility = 'visible';
                                    document.getElementById("sensorsPage").style.visibility = 'hidden';
                                    document.getElementById("motorsPage").style.display = 'none';
    });
    buttons[1].addEventListener("click", function(){
                                    document.getElementById("loginPage").style.visibility = 'hidden';
                                    document.getElementById("sensorsPage").style.visibility = 'hidden';
                                    document.getElementById("motorsPage").style.display = 'block';
    });
    buttons[2].addEventListener("click", function(){
                                    document.getElementById("loginPage").style.visibility = 'hidden';
                                    document.getElementById("motorsPage").style.display = 'none';
                                    document.getElementById("sensorsPage").style.visibility = 'visible';
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

