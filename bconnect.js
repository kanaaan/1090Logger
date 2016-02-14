const net = require('net');

var client = new net.Socket();
client.connect(31001, '127.0.0.1', function() {
console.log('Connected');
client.write('Hello, server! Love, Client.');
alert( "bconnect" );
});
