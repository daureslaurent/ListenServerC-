var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./api/config');
var session = require("express-session");

//Set MongoDB
var promise = mongoose.connect(config.finalDB, {useMongoClient: true});
// Check MongoDB connect
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("db OK");});
// Load Models
var dataModel = require('./api/models/dataModel');
var dataCtrl = require('./api/controllers/dataController');

//MidleWare
app.use(express.static("public"));
app.use(session({ secret: 'mysecret' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//app.use(require('./api/controllers/authController').decodeJwt);


dataCtrl.countAllData();

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
        console.log("[ip]["+jsonData.ip +"] " +
                    "[port]["+jsonData.port +"] " +
                    "[time]["+jsonData.timeStr +"]");
        //console.log("[port]"+jsonData.port);
        //console.log("[time]"+jsonData.time);
        //console.log("[data]"+jsonData.data);
        if (jsonData && jsonData.data !== 'QklQDQo=')
          dataCtrl.createData(jsonData);
    });

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
  });
}).listen(port);

// Put a friendly message on the terminal of the server.
console.log("Chat server running at "+port);

//Init Web
var web = require('./web/web');
web(app);
app.listen(2119);