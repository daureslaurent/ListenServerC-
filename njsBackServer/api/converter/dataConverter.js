'use strict';

var dataCtrl = require('../controllers/dataController');

exports.getAllDataSummary = function(cb){
    dataCtrl.countAllDataCallBack(function(count){
        dataCtrl.getAllData(function(datas){
            //console.log('datas['+datas+']');
            console.log('datas:'+JSON.stringify(datas));
        });
        var result = {};
        result.count = count;
        cb(result);
    });
};

