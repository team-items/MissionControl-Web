function setSliderText(evt) {
    evt.target.parentElement.parentElement.getElementsByClassName("value")[0].innerHTML = evt.target.value;
}

function setValue(evt) {
    //save value at an appropriate location
    alert(evt.target.parentElement.parentElement.getElementsByTagName("input")[0].value);
    //evt.target.parentElement.parentElement.getElementsByClassName("value")[0].innerHTML = evt.target.value;
}

function init()
{
    var buttons = document.getElementsByClassName("listElement");
    buttons[0].addEventListener("click", function(){
                                    document.getElementById("loginPage").style.display = 'none';
                                    document.getElementById("sensorsPage").style.display = 'none';
                                    document.getElementById("motorsPage").style.display = 'block';
    });
    buttons[1].addEventListener("click", function(){
                                    document.getElementById("loginPage").style.display = 'none';
                                    document.getElementById("motorsPage").style.display = 'none';
                                    document.getElementById("sensorsPage").style.display = 'block';
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
}

init();