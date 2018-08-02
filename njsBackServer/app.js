var mongoose = require('mongoose');
var config = require('./api/config');
mongoose.Promise = require('bluebird');
//Set MongoDB
var promise = mongoose.connect(config.finalDB, {useMongoClient: true});
// Check MongoDB connect
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("db OK");});
// Load Models
var dataModel = require('./api/models/dataModel');
var dataCtrl = require('./api/controllers/dataController');


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
        var jsonData = JSON.parse(data);
        console.log("[ip]"+jsonData.ip);
        console.log("[port]"+jsonData.port);
        console.log("[time]"+jsonData.time);
        console.log("[data]"+jsonData.data);
        dataCtrl.createData(jsonData);
    });

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
  });
}).listen(port);

// Put a friendly message on the terminal of the server.
console.log("Chat server running at "+port);