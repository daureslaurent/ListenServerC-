'use strict';

var validator = require('validator');
var base64 = require('base-64');
var dataCtrl = require('../controllers/dataController');
var utils = require('../utils/utils');

exports.getAllDataSummary = function(limit, cb){
    dataCtrl.countAllDataCallBack(function(count){
        dataCtrl.getCountByPortCallBack(2122, function(count2121){
            dataCtrl.getAllDataLimit(limit, function(datas){
                var result = {};
                result.data = datas;
                for (let index = 0; index < result.data.length; index++) {
                    const encodedData = result.data[index].data;
                    result.data[index].dataDecoded = base64.decode(encodedData);
                }
                result.data = utils.fancyFormatDataList(datas);
                for (let index = 0; index < result.data.length; index++) {
                    result.data[index].timeStr = utils.unixToTimeFR(result.data[index].time);//formattedTime;
                }
                //console.log(JSON.stringify(result.data))
                cb(result.data);
            });
            //console.log('datas['+datas+']');
        });

    });
};

exports.getStateServerUnix = function(cb){
    utils.testUnixServerCb(2121, function(state2121){
        utils.testUnixServerCb(2122, function(state2122){
            utils.testUnixServerCb(2123, function(state2123){
                var ret = new Array();
                ret.push({name: 'serverHTTP:80', port: 2121, state: state2121});
                ret.push({name: 'serverSSH:22', port: 2122, state: state2122});
                ret.push({name: 'serverSMTP:25', port: 2123, state: state2123});
                return cb(ret);
            });
        });
    });
};

exports.getBackState = function(cb){
    dataCtrl.countAllDataCallBack(function(countAllData){
        var ret = {};
        ret.data = {};
        ret.data.count = countAllData;
        return cb(ret);
    });
};