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
      console.log('Server['+serverIp+':'+port+'] is OK')
      client.destroy();
      return cb(true);
    }
  });
  
  // Add a 'close' event handler for the client socket
  client.on('close', function() {
  });
  
  client.on('error', function(err) {
      console.error(err);
      return cb(false);
  });
}