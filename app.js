var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./api/config');
var session = require("express-session");

var blackListData = require('./config/blackListData.json');

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
var utils = require('./api/utils/utils');

// Start a TCP Server
var base64 = require('base-64');
var currentReq = 0;

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
          currentReq++;
          console.log("Current request["+currentReq+"]");
          var jsonData = JSON.parse(msg);
          var decodedData = base64.decode(jsonData.data);
          if (jsonData && jsonData.data !== 'QklQDQo=' && jsonData.data !== 'cG9uZwo=' && jsonData.data !== 'cGluZwo=' && jsonData.data !== 'W1NFUlZFUl9TRU5EXTpwb25nCg==' && jsonData.data !== 'W1NFUlZFUl9TRU5EXTpCSVANCg=='
              && jsonData !== blackListData.blackList[0] && !validator.isEmpty(jsonData.data) && (decodedData.startsWith("[SERVER_SEND]:") == 0)){
                console.log("[port]["+jsonData.port +"] " +
                "[time]["+utils.unixToTimeFR(Number.parseInt(jsonData.time))+"] " +
                "[ip]["+jsonData.ip +"]");
            //find IP Info
            axios.get('https://ipapi.co/'+jsonData.ip+'/json/')
              .then(response => {
                var location = {"country": response.country_name,
                                "city": response.city,
                                "region": response.region };
                jsonData.location.push(location);
                console.log("ipInfo [OK]"+JSON.stringify(jsonData));
                dataCtrl.createData(jsonData); 
              })
              .catch(error => {
                console.log("ipInfo [KO]["+error+"]");
                dataCtrl.createData(jsonData); 
              });
                
                        //console.log("[data]["+jsonData.data+"]");
                        //console.log("[data]["+base64.decode(jsonData.data)+"]");

          }
        //Send alert LedLamp
        utils.ledLampAlert();
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
app.listen(2119);