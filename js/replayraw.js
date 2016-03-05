exports.closeAll= function closeAll()
{
    scopes.forEach(function (scope) {
            // write message to ADSBScope client
            scope.end();
        });
        if (server)
        {
            server.close();  
        }
}

var fpath='C:\\src\\1090Logger\\London-Washignton\\';
var server;
// Keep track of the ADSBScope clients
var scopes = [];

var filename="";
exports.filename=filename;

exports.replayFile=function replayFile()
{
    const net = require('net');
    var fs = require('fs'); 
    exports.closeAll();
    
    filename=fpath+exports.filename;
    console.log('Check file exists '+filename);
    fs.stat(filename, function(err, stat) {
        if(err == null) {
            // Keep track of the ADSBScope clients
            scopes = [];


            // Create server
            console.log('Creating server on 31002');
            server=net.createServer(function (socket) {
                // Identify the client
                socket.name = socket.remoteAddress + ":" + socket.remotePort;
                // Put the new client in the list
                scopes.push(socket);
                console.log('ADS-B scope connected');
                socket.on('close', function() {
                    console.log('ADS-B scope disconnected');
                    scopes.pop(socket);
                });
            }).listen(31002);
            console.log('Opening '+filename);
            var lineReader = require('readline').createInterface({
                input: require('fs').createReadStream(filename)
            });
            
            lineReader.on('line', function (line) {
                //console.log('Line from file:', line);
            });
        }
        else
        {
            console.log('Exiting replay '+err);   
        }
    });
 }
