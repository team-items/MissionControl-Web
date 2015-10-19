function setSliderText(evt) {
    evt.target.parentElement.parentElement.getElementsByClassName("value")[0].innerHTML = evt.target.value;
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

}

init();