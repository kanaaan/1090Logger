
exports.connectToADSBServer= function connectToADSBServer()
{
    const net = require('net');
    const fs = require('fs');

    var client = new net.Socket();
    var count=0;
    var filename='1090Logger_'+(new Date().toISOString().replace(/:/,'_').replace(/:/,'_'))+'.txt';
    console.log(filename);

    client.connect(31001, '127.0.0.1', function() {
    console.log('Connected to ADS-B server');
    });

    client.on('data', function(data) {
        count=count+1;
        
        var datatxt='';
        for (var i = 0; i < data.length; i++) {
            datatxt += decimalToHex(data[i])+' ';
        }
        
        console.log('Frame: ' +count+', Length:'+ data.length + ' '+datatxt);
        fs.appendFileSync(filename,datatxt+'\n');
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