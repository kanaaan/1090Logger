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


exports.startServer=function startServer()
{
    const net = require('net');
    exports.closeAll();
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
    
}

exports.replayFile=function replayFile()
{
    var fs = require('fs'); 
    var counter=0;
    filename=fpath+exports.filename;
    console.log('Check file exists '+filename);
    fs.stat(filename, function(err, stat) {
        if(err == null) {
            console.log('Opening '+filename);
            var lineReader = require('readline').createInterface({
                input: require('fs').createReadStream(filename)
            });
            
            lineReader.on('line', function (line) {
                //console.log('Line from file:', line);
                var res=line.split(" ")
                var inttab= [];
                //Skip the first item timestamp and last item the return line
                for (var i = 1; i < res.length-1; i++) {
                    inttab[i-1]=parseInt(res[i],16);
                }
                counter=counter+1;
                //console.log(counter);
                // dispacth message to clients
                scopes.forEach(function (scope) {
                    // write message to ADSBScope client
                    scope.write(new Buffer(inttab));
                });
                lineReader.pause();
                setTimeout(function () {
                    lineReader.resume();
                }, 8000);
            });
            
            lineReader.on('end', function () {
                console.log("Replay ended");
            });
        }
        else
        {
            console.log('Exiting replay '+err);   
        }
    });
 }
