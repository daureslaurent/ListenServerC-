'use strict';
var mongoose = require('mongoose');
var Data = mongoose.model('Data');

exports.createData = function(data){
  var newData = new Data(data);
  newData.save(function(err, data) {
  if (err)
    console.log("erreur createData: "+err);
  else
    console.log("createData OK");
  });
};