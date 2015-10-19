function setSliderText(val, ind) {
    "use strict";
    var values = document.getElementsByClassName("value");
    values[ind].textContent = val;
}


var servos = document.getElementsByClassName("servosSlider");
var i;
for (i = 0; i < servos.length; i++) {
    servos[i].addEventListener("input", function(){setSliderText(servos[i].value, i)});
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
}

init();