var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./api/config');
var session = require("express-session");


var IpInfoApi = require('./api/extApi/ipApi');

const axios = require('axios');

//Set MongoDB
var promise = mongoose.connect(config.finalDB, {useMongoClient: true});
// Check MongoDB connect
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("db OK");});
// Load Models
var dataModel = require('./api/models/dataModel');
var serverModel = require('./api/models/serverModel');
var ipModel = require('./api/models/ipModel');

var dataCtrl = require('./api/controllers/dataController');
var ipCtrl = require('./api/controllers/ipController');


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
var utils = require('./api/utils/utils');

// Start a TCP Server
var base64 = require('base-64');
var currentReq = 0;
const statCtrl = require('./api/controllers/statController');

net.createServer(function (socket) {

  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort 

  // Put this new client in the list
  clients.push(socket);

  var validator = require('validator');

  

  socket.on('error', function(err){
    console.log("Error: "+err.message);
  })
  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    //Check multiple msg
    var msg = String(data);
    if (msg.includes("{") && msg.includes("}")){
      var listMsg = msg.split("}");

      //loop on msg
      for (let index = 0; index < listMsg.length; index++) {
        var msg = listMsg[index];
        if (msg.length > 1){
          msg += '}';
          
          //console.log("Current request["+currentReq+"]");
          var jsonData = JSON.parse(msg);
          if (utils.validateUnixData(jsonData)){
            currentReq++;
            var currIp = jsonData.ip;
            ipCtrl.ipExist(currIp).then(function(exist){
              if (exist){
                return new Promise(function(resolve, reject) {
                  //GetDataIp & return data filled
                  ipCtrl.getIpLocation(currIp).then(function(location){
                    jsonData.location = location;
                    resolve(jsonData);
                  })
                });
              }
              else {
                return new Promise(function(resolve, reject){
                  IpInfoApi.getIpInfo(currIp)
                  .then(location => {
                    ipCtrl.createIp({ip: currIp, location: location});
                    //console.log(location);
                    jsonData.location = location;
                    resolve(jsonData);
                  })
                  .catch(error => {
                    console.log("ipInfo [KO]["+error+"]");
                    resolve(jsonData);
                  });
                });
              }
            }).then(function(endData){
              statCtrl.addLogConsole({
                port: endData.port,
                time: utils.unixToTimeFR(Number.parseInt(endData.time)), 
                ip: endData.ip,
                data: endData.data})
              //dataCtrl.createData(endData);
              //Send alert LedLamp
              utils.ledLampAlert();
            })
          }
        }
      }
    }
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

//start Routine Manager
const RoutineManager = require('./api/routine/routineManager');
var routineManager = new RoutineManager(3);
//routineManager.run();

const MenuManager = require('./api/prompt/MenuManager');
var menuManager = new MenuManager();
menuManager.run();

//const PromptCustom = require('./api/prompt/prompt');
//var promptCustom = new PromptCustom();
//promptCustom.run();
//routineManager.run();

app.listen(2119);