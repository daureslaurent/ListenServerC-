'use strict';
var mongoose = require('mongoose');
var dataModel = mongoose.model('Data');

exports.createData = function(data){
  var newData = new dataModel(data);
  newData.save(function(err, data) {
  if (err)
    console.log("erreur createData: "+err);
  });
};

exports.getAllData = function(cb) {
  var promise = dataModel.find({}).exec();
  promise.then(function(datas){
    cb(datas);
  })
  .catch(function(err){
    console.log('getAllData: err: '+err);
  });
};

exports.countAllData = function() {
  dataModel.count({}, function( err, count){
    console.log( "Number of users:", count );
  })
};

exports.countAllDataCallBack = function(cb){
  var promise = dataModel.count().exec();
  promise.then(function(count){
    cb(count);
  })
  .catch(function(err){
    console.log('countAllDataCallBack: err: '+err);
  });
}

exports.getCountByPortCallBack = function(port, cb){
  var promise = dataModel.count({'port':port}).exec();
  promise.then(function(datas){
    cb(datas);
  })
  .catch(function(err){
    console.log('getCountByPortCallBack('+port+'): err: '+err);
  });
};