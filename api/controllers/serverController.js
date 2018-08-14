'use strict';
var mongoose = require('mongoose');
var serverModel = mongoose.model('Server');

var test = false;
exports.getAllServerCb = function(cb){
  if (!test){
    //this.createServer('192.168.1.17', 'TestServ', '2121', '80');
  }
  var promise = serverModel.find({}).exec();
  promise.then(function(serverList){
    cb(serverList);
  })
  .catch(function(err){
    console.log('getAllServer: err: '+err);
  });
}

exports.getServerByIdCb = function(id, cb){
  var promise = serverModel.find({'_id':id}).exec();
  promise.then(function(server){
    cb(server);
  })
  .catch(function(err){
    console.log('getAllServer: err: '+err);
  });
};

exports.setPIDServer = function(pid, id){
  var promise = serverModel.update({ _id: id }, { $set: { 'pid': pid }}).exec();
  promise.then(function(serverList){})
  .catch(function(err){
    console.log('getAllServer: err: '+err);
  });
}

exports.createServer = function(addr, name, port, redirect){
  //{"addr": "192.168.1.17", "name": "serverHTTP", "port": "2121", "redirect": "80:WEB"}
  var promise = serverModel.find({'ip':addr, 'port':port}).exec();
  promise.then(function(serverList){
    if (serverList.length === 0){
      console.log('CreateNewServer');
      var newServer = new serverModel();
      newServer.ip = addr;
      newServer.name = name;
      newServer.port = port;
      newServer.redirect = redirect;
      newServer.save(function(err, server) {
      if (err)
        console.log("erreur createServer: "+err);
      });
    }
  })
  .catch(function(err){
    console.log('getAllServer: err: '+err);
  });
};