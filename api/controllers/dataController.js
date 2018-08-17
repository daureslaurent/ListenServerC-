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
  var promise = dataModel.find({}).sort({time: -1}).exec();
  promise.then(function(datas){
    cb(datas);
  })
  .catch(function(err){
    console.log('getAllData: err: '+err);
  });
};

exports.getAllDataLimit = function(limit, cb) {
  var promise = dataModel.find({}).sort({time: -1}).limit(limit).exec();
  promise.then(function(datas){
    cb(datas);
  })
  .catch(function(err){
    console.log('getAllData: err: '+err);
  });
};

exports.getAllDataSkipLimitCb = function(skip, limit, cb) {
  var promise = dataModel.find({}).sort({port: -1}).skip(skip).limit(limit).exec();
  promise.then(function(datas){
    cb(datas);
  })
  .catch(function(err){
    console.log('getAllData: err: '+err);
  });
};

exports.getAllDataSkipLimit = function(skip, limit) { 
  var promise = dataModel.find({}).skip(skip).limit(limit).exec(function(err, data){
    return data;
  });
};

exports.countAllData = function() {
  dataModel.count({}, function( err, count){
    console.log( "Number of records:", count );
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

exports.getDataByPortCallBack = function(port, cb){
  var promise = dataModel.find({'port':port})
                .sort({time: -1})
                .exec();
  promise.then(function(data){
    cb(data);
  })
  .catch(function(err){
    console.log('getCountByPortCallBack('+port+'): err: '+err);
  });
};

exports.getDataByPortSkipLimit = function(port, skip, limit, cb) { 
  var promise = dataModel.find({'port':port}).skip(skip).limit(limit).exec();
  promise.then(function(datas){
    cb(datas);
  })
  .catch(function(err){
    console.log('getAllData: err: '+err);
  });
};


exports.getAllDataByPortCallBack = function(port, dataCtrl, cb){
  dataCtrl.getCountByPortCallBack(port, function(count){
    var curPage = 0;
    var paging = 999;
    var maxPage = count - 1;
    var tmpArr = new Array();
    var nbOccur = Math.ceil(maxPage/paging);
    var currOccur = 0;
    for (;curPage < maxPage; curPage += paging) {
      if (curPage+paging > maxPage){
          paging = maxPage - curPage;
      }
      dataCtrl.getDataByPortSkipLimit(port, curPage, paging, function(data){
          currOccur++;
          tmpArr = tmpArr.concat(data);
          if (currOccur >= nbOccur){
              cb(tmpArr);
          }
      });
    }
  });
};


exports.getDataByPortLimitCallBack = function(port, limit, cb){
  var promise = dataModel.find({'port':port})
                .sort({time: -1})
                .limit(limit)
                .exec();
  promise.then(function(data){
    cb(data);
  })
  .catch(function(err){
    console.log('getCountByPortCallBack('+port+'): err: '+err);
  });
};

exports.getDataByIpCallBack = function(ip, cb){
  var promise = dataModel.find({'ip':ip})
                .sort({time: -1})
                .exec();
  promise.then(function(data){
    cb(data);
  })
  .catch(function(err){
    console.log('getDataByIpCallBack('+port+'): err: '+err);
  });
};
