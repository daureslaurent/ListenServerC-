'use strict';

var base64 = require('base-64');
var axios = require('axios');
var configLamp = require('../../config/ledLamp.json');
var serverCtrl = require('../controllers/serverController');
var serverConf = require('../../config/server.json');

exports.unixToTimeStr = function(timeUnix){
  var date = new Date(timeUnix*1000);
  return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
};

exports.unixToTimeFR = function(timeUnix){
  return this.unixToTimeStr(timeUnix+ 7200);
};

exports.testUnixServerCb = function(serverIp, port, cb){
  var key = serverIp+port;
  var client = new net.Socket();
  client.connect(port, serverIp, function() {
    client.write('ping\n');
  });
  
  client.on('data', function(data) {
    var sended = false;
    if (data == 'pong\n'){
      if (!sended){
        cb(true, key);
        sended = true;
      }
      //client.destroy();
    }
    if (!sended){
      cb(true, key);
      sended = true;
    }
    //client.destroy();
  });
  
  // Add a 'close' event handler for the client socket
  client.on('close', function() {
    client.destroy();
  });
  
  client.on('error', function(err) {
    cb(false, key);
    client.destroy();
  });
};

exports.testUnixServerMsg = function(serverIp, port, msg){
  var client = new net.Socket();
  client.connect(port, serverIp, function() {
    client.write(msg);
  });
  client.on('data', function(data) {
      console.log('Server['+serverIp+':'+port+'] ['+data+']');
      //client.destroy();
  });
  client.on('close', function() {
    client.destroy();
  });
  client.on('error', function(err) {
      client.destroy();
  });
};

exports.getLogServerUnix = function(addr, port, cb){
  var key = addr+port;
  var client = new net.Socket();

  client.connect(port, addr, function() {
    var sended = false;

    client.on('data', function(data) {
      if (!sended){
        cb(data, key);
        sended = true;
      }
      //client.destroy();
    });
  
    // Add a 'close' event handler for the client socket
    client.on('close', function() {

      if (!sended){
        cb('close', key);
        sended = true;
      }
      //client.destroy();
    });
    client.write('log\n');
  });

  client.on('error', function(err) {
    cb('err', key);
    client.destroy();
  });
};

exports.getVersionServerUnix = function(addr, port, cb){
  var key = addr+port;
  var client = new net.Socket();

  client.connect(port, addr, function() {
    var sended = false;

    client.on('data', function(data) {
      if (!sended){
        cb(data, key);
        sended = true;
      }
      //client.destroy();
    });
  
    // Add a 'close' event handler for the client socket
    client.on('close', function() {

      if (!sended){
        cb('close', key);
        sended = true;
      }
      //client.destroy();
    });
    client.write('VERSION\n');
  });

  client.on('error', function(err) {
    cb('err', key);
    client.destroy();
  });
};

exports.formatDataForWebCb = function(data, cb){
  for (let index = 0; index < data.length; index++) {
      const encodedData = data[index].data;
      var decodedData = base64.decode(encodedData)
      data[index].dataDecoded = decodedData.replace(serverConf.ip, serverConf.hideIp);
  }
  data = this.fancyFormatDataList(data);
  for (let index = 0; index < data.length; index++) {
      data[index].timeStr = this.unixToTimeFR(data[index].time);
  }
  this.convertPortRedirectionCb(data, function(end){
    cb(end);
  });
}

exports.fancyFormatDataList = function(dataList){
  var map = new Map();
  
  for (let index = 0; index < dataList.length; index++) {
    const elem = dataList[index];
    var elemLocal = {ip: elem.ip, port: elem.port, time: elem.time, data: new Array(), _id: elem._id};
    var mapElem = map.get(elem.ip);
    if (!mapElem){
      elemLocal.data.push(elem.dataDecoded);
      map.set(elem.ip, elemLocal);
    }
    else {
      mapElem.data.push(elem.dataDecoded)
      if (elem.time >= mapElem.time)
        mapElem.time = elem.time;
      map.set(elem.ip, mapElem);
    }
  }  
  var arr = new Array();
  map.forEach(function(value, key, map){
    arr.push(value);
  })
  //console.log(arr);
  return arr;
}




exports.convertPortRedirectionCb = function(listData, cb){
  serverCtrl.getAllServerCb(function(serverList){
    var map = new Map();
    for (let index = 0; index < serverList.length; index++) {
      const server = serverList[index];
      map.set(server.port, server.redirect);
    }

    for (let index = 0; index < listData.length; index++) {
      var redi = map.get(listData[index].port);
      if (redi)
        listData[index].port = redi;
      //console.log(listData[index])
    }
    cb(listData);
  });
};

exports.getRedirectionCb = function(port, cb){
  serverCtrl.getAllServerCb(function(serverList){
    for (let index = 0; index < serverList.length; index++) {
      const server = serverList[index];
      if (server.port == port){
        return cb(server.redirect);
      }
    }
    return cb(port);
  });
}

exports.ledLampAlert = function(){
  var axios = require('axios');
  var configLamp = require('../../config/ledLamp.json');


  var addr = ("http://" + configLamp.server + ':' + configLamp.port + configLamp.uriAlert).toString();
  axios.get(addr)
  .then(function (response) {
    // handle success
    //console.log(response);
  })
  .catch(function (error) {
    // handle error
    //console.log(error);
  })
  .then(function () {
    // always executed
  });
};