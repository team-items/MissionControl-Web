var connection;
var connACK;
var connLAO;
var status;

var connREQ = '{'+
              '  "ConnREQ" : {'+
                    '"HardwareType" : "Web",'+
                    '"SupportedCrypto" : [],'+
                    '"PreferredCrypto" : "None",'+
                        
                    '"SupportedDT" : [ "Bool", "String", "Integer", "Slider" ],'+
                    '"PublicKeys" : []'+
                '}'+
                '}'; 
var connSTT = '{"ConnSTT" : {"Thanks" : "M8"}}';

var controlMessage = '{"Control" : {"SomeSlider" : 76,"SomeButton" : "click"}}';
var currMessage;

var sensors = [];
//will be sent to server in a certain period
var dataMessage = { "Control" : {} };   

/**
 * @param {string} name name of the object
 */
function getMIDaCValue(name)
{
    var retVal = 0;
    try 
    {
        var valuesJson = JSON.parse(currMessage);
        retVal = valuesJson['Data'][name];
    }
    catch(e)
    {
        console.error("Couldn't get value of" + name + ":\n" + e.message);
    }
    return retVal;
}

function setupConnection(address)
{
    var connJson = JSON.parse(connREQ);
    var packageExistCounter = 0;
    var packageExistLimit = 10;
    
    try
    {
        console.log(address);
        connection = new WebSocket("ws://" + address);
        if (connection == null)
        {
            throw "Couldn't connect to server"; 
        }
        else
        {
            // When the connection is open, send some data to the server
            connection.onopen = function () 
            {
                status = 0;
                connection.send(connREQ); // Send the connREQ message to the server
            };

            // Errors
            connection.onerror = function (error) 
            {
                console.log('WebSocket Error: ' + error.message);
            };

            // Messages from the server
            connection.onmessage = function (message) 
            {
                if (packageExistCounter >= packageExistLimit)
                {
                    packageExistCounter = 0;
                    console.log("package recieve timed out");
                    currMessage = "";
                }
                //console.log('\nServer: \n' + message.data);
                currMessage = message.data;
                
                //console.log(status);
                if (status == 0)
                {
                    if (check_connACK())
                    {
                        status = 1;
                    }
                }
                else if (status == 1)
                {
                    if (check_connLAO())
                    {
                        status = 2; 
                        connection.send(connSTT);
                        changeToSerAndMotPage();
                        
                        
                        attachEvents();
                        
                        //begin sending data to server
                    }
                }
                else if (status == 2){
                    //console.log(currMessage);
                    update();
                }
            };
        }
    }
    catch(e)
    {
        console.error(e.name);
        console.error(e.message);
    }
}
                                   


function check_connACK()
{

    var isNoError = true;
    
    {
        var currJson = JSON.parse(currMessage);

        if (currJson.ConnREJ != null)
        {                
            if (currJson.ConnREJ.Error != null && 
                Object.values(currJson.ConnREJ.Error).length > 0)
            {
                    alert("Error: " + currJson.ConnREJ.Error);
                    done = true;
                    isNoError = false;
            }
            else
            {
                throw "Didn't recieve the entire Message";
            }
        }
        else if (currJson.ConnACK != null)
        {
            connACK = currJson;  
        }
    }
    return isNoError;
}   

function process_bool(boolElements)
{
    var maxPoints = 20;
    var currMaxPoints;
    for (elem in boolElements)
    {
        
        currMaxPoints = boolElements[elem].Graph;
        if (currMaxPoints != null)
        {
            maxPoints = currMaxPoints;   
        }
        addGraph($("#sensorCol2"), maxPoints, elem, -1, 2);
    }
}

function process_integer(intElements)
{
    var maxPoints = 20;
    var currMaxPoints;
    for (elem in intElements)
    {
        
        currMaxPoints = intElements[elem].Graph;
        if (currMaxPoints != null)
        {
            maxPoints = currMaxPoints;   
        }
        addGraph($("#sensorCol1"), 
                 maxPoints, 
                 elem, 
                 intElements[elem].MinBound, 
                 intElements[elem].MaxBound
                );
    }
}

function process_float(floatElements)
{
    var maxPoints = 20;
    var currMaxPoints;
    for (elem in floatElements)
    {
        
        currMaxPoints = floatElements[elem].Graph;
        if (currMaxPoints != null)
        {
            maxPoints = currMaxPoints;   
        }
        addGraph($("#sensorCol1"), 
                 maxPoints, 
                 elem, 
                 floatElements[elem].MinBound, 
                 floatElements[elem].MaxBound
                );
    }
}

function process_string(strElements)
{
    var length;
    for (elem in strElements)
    {
        length = strElements.MaxLength;
        
        //process something with strings
    }
}

function process_button(buttonElement, containerName)
{
    var nameOfButton = buttonElement.Descriptor;
    
    addButton($("#servos"), containerName, nameOfButton);
}

function process_slider(sliderElement, sliderName)
{
    var minBound = sliderElement.MinBound;
    var maxBound = sliderElement.MaxBound;
    
    addSlider($("#motors"), sliderName, minBound, maxBound);
}

function process_control_group(groupElements, groupName)
{
    var nameOfContainer = groupName;
    var nameOfButton = "";
    var minBound, maxBound;
    var sliderName;
    var buttonName;
    
    for (elem in groupElements)
    {
        if (groupElements[elem].ControlType == "Slider")
        {
            minBound = groupElements[elem].MinBound;
            maxBound = groupElements[elem].MaxBound;
            sliderName = elem;
        }
        else if (groupElements[elem].ControlType == "Button")
        {
            nameOfButton = groupElements[elem].Descriptor;
            buttonName = elem;
        }
        console.log(elem);
    }
    
    console.log(buttonName);
    
    
    if (nameOfContainer.search(/servo/i) != -1)
    {
        addSliderAndButton($("#servos"), nameOfContainer, buttonName, sliderName, minBound, maxBound, nameOfButton);   
    }
    else if (nameOfContainer.search(/motor/i) != -1)
    {
        addSliderAndButton($("#motors"), nameOfContainer, buttonName, sliderName, minBound, maxBound, nameOfButton);   
    }
    else
    {
        if ($("#servos").children().length < $("#motors").children().length)
        {
            addSliderAndButton($("#servos"), nameOfContainer, buttonName, sliderName, minBound, maxBound, nameOfButton);      
        }
        else
        {
            addSliderAndButton($("#motors"), nameOfContainer, buttonName, sliderName, minBound, maxBound, nameOfButton);
        }
    }
    
}

function sendData()
{
    console.log("sending data...");
    console.log(dataMessage);
    connection.send(JSON.stringify(dataMessage));
    dataMessage = { "Control" : {}};
}

/**
 * @param {string} objectName name of the element you want to talk to
 * @param {integer} value value to be set
 */
function addToDataMessage(objectName, value)
{
    console.log(typeof(value));
    if (value != "click")
    {
        if (value.search(".") != -1)
        {
            dataMessage.Control[objectName] = parseFloat(value);
        }
        else
        {
            dataMessage.Control[objectName] = parseInt(value);
        }
    }
    else
    {
        dataMessage.Control[objectName] = "click";   
    }
    sendData();
}

function check_connLAO()
{
    var succeeded = true;

    try 
    {
        var currJson = JSON.parse(currMessage);

        if (currJson.ConnLAO != null)
        {
            connLAO = currJson;
            console.log(currMessage); 
            if (currJson.ConnLAO.Information != null && currJson.ConnLAO.Controller != null)
            {
                var connLAO = currJson.ConnLAO;
                for (type in connLAO.Information)
                {
                    if (type == "Bool")
                    {
                        process_bool(connLAO.Information[type]);                    
                    }
                    else if (type == "Integer")
                    {
                        process_integer(connLAO.Information[type]);                    
                    }
                    else if (type == "Float")
                    {
                        process_float(connLAO.Information[type]);                    
                    }
                    else if (type == "String")
                    {
                        process_string(connLAO.Information[type]);                    
                    }
                    
                }
                for (group in connLAO.Controller)
                {
                    if (connLAO.Controller[group].ControlType == "Button")
                    {
                        process_button(connLAO.Controller[group], group);
                    }
                    else if (connLAO.Controller[group].ControlType == "Slider")
                    {
                        process_slider(connLAO.Controller[group], group);
                    }
                    else
                    {
                        process_control_group(connLAO.Controller[group], group); 
                    }
                }
                
            }
            else 
            {
                succeeded = false;
                throw "Information or Controller not in the message";
            }
        }
        else
        {
            succeeded = false;   
        }
    }
    catch(e)
    {
        console.error(e.message);
    }
    return succeeded;
}