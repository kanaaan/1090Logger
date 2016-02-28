exports.closeAll= function closeAll()
{
    scopes.forEach(function (scope) {
            // write message to ADSBScope client
            scope.end();
        });
    server.close();
    client.end();
}

var server;
var client;
// Keep track of the ADSBScope clients
var scopes = [];
    
exports.connectToADSBServer= function connectToADSBServer()
{
    const net = require('net');
    const fs = require('fs');

    // Keep track of the ADSBScope clients
    scopes = [];

    client = new net.Socket();
    var count=0;
    var filename='1090Logger_'+(new Date().toISOString().replace(/:/,'_').replace(/:/,'_'))+'.txt';
    console.log(filename);
    //$("#applicationname").typed({strings: ["1090 Logger"],typeSpeed: 0});
    // Connect to ADSB server
    client.connect(31001, '127.0.0.1', function() {
        console.log('Connected to ADS-B server');
    });

    // Create server
    server=net.createServer(function (socket) {
        // Identify the client
        socket.name = socket.remoteAddress + ":" + socket.remotePort;
        // Put the new client in the list
        scopes.push(socket);
    }).listen(31002);

    client.on('data', function(data) {
        // dispacth message to clients
        scopes.forEach(function (scope) {
            // write message to ADSBScope client
            scope.write(data);
        });
        // Increment messages counter
        count=count+1;

        var datatxt='';
        for (var i = 0; i < data.length; i++) {
            datatxt += decimalToHex(data[i])+' ';
        }
        console.log('Frame: ' +count+', Length:'+ data.length + ' '+datatxt);
        fs.appendFileSync(filename,getDateTimeStr()+" "+datatxt+'\n');
        // Add tp consoletxt
        var consoletxt='Frame: ' +count+', Length:'+ data.length;
        $("#consoletxt").html(consoletxt);
    });

    client.on('close', function() {
        console.log('Connection to ADS-B closed');
    });
};

function decimalToHex(d) {
    var hex = Number(d).toString(16).toUpperCase();
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
}

function getDateTimeStr() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + "-" + hour + ":" + min + ":" + sec+"."+date.getMilliseconds();

}
