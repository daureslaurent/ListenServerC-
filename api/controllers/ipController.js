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

var getIpSkipLimitPromise = function(skip, limit){
  return new Promise(function(resolve, reject){
    ipModel.find({})
    .skip(skip)
    .limit(limit)
    .select("-_id").select("-__v").exec()
    .then(function(data){
      resolve(data);
    })
  });
}

exports.getAllIp = function(){
  var countAllIp = ipModel.count({}).exec();

  return new Promise(function(resolve, reject){
    countAllIp.then(function(count){
      var curPage = 0;
      var paging = 900;
      var maxPage = count - 1;
      var promiseArray = new Array();

      for (;curPage < maxPage; curPage += paging) {
        if (curPage+paging > maxPage){
            paging = maxPage - curPage;
        }
        promiseArray.push(getIpSkipLimitPromise(curPage, paging));
      }
      return Promise.all(promiseArray).then(dataArray => {
        var datas = new Array();
        for (let index = 0; index < dataArray.length; index++) {
            datas = datas.concat(dataArray[index]);
        }
        resolve(datas);
      }).catch(function(err){console.log(err)});
    });
  });
}

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