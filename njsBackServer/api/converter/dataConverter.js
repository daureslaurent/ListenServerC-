'use strict';

var validator = require('validator');
var base64 = require('base-64');
var dataCtrl = require('../controllers/dataController');
var utils = require('../utils/utils');
var serverList = require('../../config/server.json').serverList;
var serverConf = require('../../config/server.json');


exports.getAllDataSummary = function(limit, cb){
    dataCtrl.countAllDataCallBack(function(count){
        dataCtrl.getCountByPortCallBack(2122, function(count2121){
            dataCtrl.getAllDataLimit(limit, function(datas){
                var result = {};
                result.data = datas;
                for (let index = 0; index < result.data.length; index++) {
                    const encodedData = result.data[index].data;
                    var decodedData = base64.decode(encodedData)
                    result.data[index].dataDecoded = decodedData.replace(serverConf.ip, serverConf.hideIp);
                }
                result.data = utils.fancyFormatDataList(datas);
                for (let index = 0; index < result.data.length; index++) {
                    result.data[index].timeStr = utils.unixToTimeFR(result.data[index].time);//formattedTime;
                }
                result.data = utils.convertPortRedirection(result.data);
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
                utils.testUnixServerCb(2124, function(state2124){
                    var arr = new Array();
                    var map = new Map();
                    map.set('2121', state2121);
                    map.set('2122', state2122);
                    map.set('2123', state2123);
                    map.set('2124', state2124);

                    for (let index = 0; index < serverList.length; index++) {
                        var element = serverList[index];
                        element.state = map.get(element.port);
                        arr.push(element);
                    }
                    return cb(arr);
                });
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