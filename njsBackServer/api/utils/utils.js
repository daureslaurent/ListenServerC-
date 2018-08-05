'use strict';
var serverList = require('../../config/server.json').serverList;



exports.unixToTimeStr = function(timeUnix){
  var date = new Date(timeUnix*1000);
  return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
};

exports.unixToTimeFR = function(timeUnix){
  return this.unixToTimeStr(timeUnix+ 7200);
};

exports.testUnixServerCb = function(serverIp, port, cb){
  var client = new net.Socket();
  client.connect(port, serverIp, function() {
    client.write('ping\n');
  });
  
  client.on('data', function(data) {
    if (data == 'pong\n'){
      //console.log('Server['+serverIp+':'+port+'] is OK')
      client.destroy();
      return cb(true);
    }
    client.destroy();
    return cb(true);
  });
  
  // Add a 'close' event handler for the client socket
  client.on('close', function() {
    client.destroy();
  });
  
  client.on('error', function(err) {
      client.destroy();
      return cb(false);
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

exports.formatDataForWeb = function(data){
  for (let index = 0; index < data.length; index++) {
      const encodedData = data[index].data;
      var decodedData = base64.decode(encodedData)
      data[index].dataDecoded = decodedData.replace(serverConf.ip, serverConf.hideIp);
  }
  data = utils.fancyFormatDataList(data);
  for (let index = 0; index < data.length; index++) {
      data[index].timeStr = utils.unixToTimeFR(data[index].time);
  }
  data = utils.convertPortRedirection(data);
  return cb(data);
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

  exports.convertPortRedirection = function(listData){
    var map = new Map();
    for (let index = 0; index < serverList.length; index++) {
      map.set(serverList[index].port.toString(), serverList[index].redirect);
    }

    for (let index = 0; index < listData.length; index++) {
      var redi = map.get(listData[index].port.toString());
      if (redi)
        listData[index].port = redi;
    }
    return listData;
  }

  var arr = new Array();
  map.forEach(function(value, key, map){
    arr.push(value);
  })
  //console.log(arr);
  return arr;
}