'use strict';



exports.unixToTimeStr = function(timeUnix){
  var date = new Date(timeUnix*1000);
  return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
};

exports.unixToTimeFR = function(timeUnix){
  return this.unixToTimeStr(timeUnix+ 7200);
};
var serverIp = '192.168.1.17';

exports.testUnixServerCb = function(port, cb){
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

exports.fancyFormatDataList = function(dataList){
  var map = new Map();
  console.log(dataList.length)
  for (let index = 0; index+1 < dataList.length; index++) {
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