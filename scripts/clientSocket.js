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
                        //addGraph($("#sensorsCol1"), "Yolo", 20, 0, 1024);
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
                    console.log(type);   
                }
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