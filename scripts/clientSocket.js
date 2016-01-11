var connection;
var connACK;
var connLAO;
var status;

var connREQ = '{'+
              '  "ConnREQ" : {'+
                    '"HardwareType" : "Smartphone",'+
                    '"SupportedCrypto" : [ "RSA512" ],'+
                    '"PreferredCrypto" : "None",'+
                        
                    '"SupportedDT" : [ "Bool", "String", "Integer", "Slider" ],'+
                    '"PublicKeys" : [ "key" ]'+
                '}'+
                '}'; 
var connSTT = '{"ConnSTT" : {}}';

var controlMessage = '{"Control" : {"SomeSlider" : 76,"SomeButton" : "click"}}';
var currMessage = "";

function getMIDaCValue(name)
{
    var laoJson = JSON.parse(currMessage);
    return laoJson[name];
}

function setupConnection(address)
{
    var connJson = JSON.parse(connREQ);
    var packageExistCounter = 0;
    var packageExistLimit = 10;
    
    try
    {
        connection = new WebSocket("ws://192.168.1.120:62626");
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
                console.log('WebSocket Error ' + error);
            };

            // Messages from the server
            connection.onmessage = function (message) 
            {
                if (packageExistCounter >= packageExistLimit)
                {
                    packageExistCounter = 0;
                    console.log("package recieve timed out")
                    currMessage = "";
                }
                console.log('\nServer: \n' + message.data);
                currMessage = message.data;
                
                console.log(status);
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
                    }
                }
            }
        }
    }
    catch(e)
    {
        console.error(e.message);
    }
}
                                   


function check_connACK()
{

    var isNoError = true;
    
    {
        var currJson = JSON.parse(currMessage);

        if (currJson["ConnREJ"] != null)
        {                
            if (currJson["ConnREJ"]["Error"] != null && 
                Object.values(currJson["ConnREJ"]["Error"]).length > 0)
            {
                    alert("Error: " + currJson["ConnREJ"]["Error"]);
                    done = true;
                    isNoError = false;
            }
            else
            {
                throw "Didn't recieve the entire Message";
            }
        }
        else if (currJson["ConnACK"] != null)
        {
            connACK = currJson;  
        }
        else
        {

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

        if (currJson["ConnACK"] != null)
        {
            connLAO = currJson;   
        }
    }
    catch(e)
    {
        console.error(e.message);
    }
    return true;
}