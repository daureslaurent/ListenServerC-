'use strict';
var mongoose = require('mongoose');
var ipModel = mongoose.model('Ip');

exports.createIp = function(data){
  console.log("CreateIp: "+JSON.stringify(data))
  var newIp = new ipModel(data);
  newIp.save(function(err, data) {
  if (err)
    console.log("erreur CreateIp: "+err);
  });
};

exports.countAllIp = function() {
  ipModel.count({}, function( err, count){
    console.log( "Number of records:", count );
  })
};

/* ========================== PROMISE ========================== */

exports.getIpLocation = function(ip){
  return new Promise(function(resolve, reject) {
    ipModel.find({'ip':ip}).exec()
    .then(function(ip){
      resolve(ip[0].location);
    })
  });
};

exports.ipExist = function(ip){
  return new Promise(function(resolve, reject) {
    ipModel.count({'ip': ip}).exec()
    .then(function(count){
      resolve(count > 0);
    })
  });
};