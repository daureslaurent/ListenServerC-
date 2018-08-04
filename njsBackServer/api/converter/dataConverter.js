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
                    result.data[index].dataDecoded = base64.decode(encodedData);//validator.escape(base64.decode(encodedData));
                    result.data[index].timeStr = utils.unixToTimeFR(result.data[index].time);//formattedTime;
                    result.data[index].time = null
                }
                cb(result);
            });
            //console.log('datas['+datas+']');
        });

    });
};

exports.getStateServerUnix = function(cb){
    utils.testUnixServerCb(2121, function(state2121){
        utils.testUnixServerCb(2122, function(state2122){
            var ret = new Array();
            ret.push({name: 'serverHTTP', port: 2121, state: state2121});
            ret.push({name: 'serverSSH', port: 2122, state: state2122});
            return cb(ret);
        });
    });
}