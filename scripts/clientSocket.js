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
var currMessage = "";

var sensors = [];

/**
 * @param {string} name name of the object
 */
function getMIDaCValue(name)
{
    var retVal = 0;
    try 
    {
        var valuesJson = JSON.parse(currMessage);
        retVal = valuesJson[name];
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
        connection = new WebSocket("ws://items.ninja:62626");
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
                        addGraph($(".sensorsCol")[0], 20, "Yolo", 0, 1024);
                        addSlider($("#servos"), "Trolo", 20, 100);
                        attachEvents();
                    }
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

function check_connLAO()
{
    var succeeded = true;

    try 
    {
        var currJson = JSON.parse(currMessage);

        if (currJson.ConnLAO != null)
        {
            connLAO = currJson;
            console.log(connLAO); 
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
                        process_integer(connLAO.Information.Integer);                    
                    }
                    else if (type == "Float")
                    {
                        process_float(connLAO.Information.Float);                    
                    }
                    else if (type == "String")
                    {
                        process_string(connLAO.Information.String);                    
                    }
                    
                }
                //add event listener for stopButtons
                addStopButtonEvent();
                for (element in connLAO.Controller)
                {
                    console.log(typeof(element)); 
                    console.log(element);   
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