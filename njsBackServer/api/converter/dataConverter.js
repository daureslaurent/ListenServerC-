'use strict';

var validator = require('validator');
var base64 = require('base-64');
var dataCtrl = require('../controllers/dataController');
var utils = require('../utils/utils');

exports.getAllDataSummary = function(cb){
    dataCtrl.countAllDataCallBack(function(count){
        dataCtrl.getCountByPortCallBack(2122, function(count2121){
            dataCtrl.getAllData(function(datas){
                var result = {};
                result.count = count;
                result.count2121 = count2121;
                result.data = datas.reverse();
                for (let index = 0; index < result.data.length; index++) {
                    const encodedData = result.data[index].data;
                    result.data[index].data = base64.decode(encodedData);//validator.escape(base64.decode(encodedData));
                    result.data[index].timeStr = utils.unixToTimeFR(result.data[index].time);//formattedTime;
                    result.data[index].time = null
                }
                cb(result);
            });
            //console.log('datas['+datas+']');
        });

    });
};

