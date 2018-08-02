// Load the TCP Library
net = require('net');

// Keep track of the chat clients
var clients = [];
var port = 2120;

// Start a TCP Server
net.createServer(function (socket) {

  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort 

  // Put this new client in the list
  clients.push(socket);

  // Handle incoming messages from clients.
    socket.on('data', function (data) {
        console.log('receive['+data+']');
    });

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
  });
}).listen(port);

// Put a friendly message on the terminal of the server.
console.log("Chat server running at "+port);