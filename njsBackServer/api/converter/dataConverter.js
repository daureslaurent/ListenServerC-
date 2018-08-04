'use strict';

var validator = require('validator');
var base64 = require('base-64');
var dataCtrl = require('../controllers/dataController');
var utils = require('../utils/utils');
var serverList = require('../../config/server.json').serverList;
var serverConf = require('../../config/server.json');
var backConf = require('../../config/webDisp.json');


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
    utils.testUnixServerCb(serverList[0].addr, serverList[0].port, function(state2121){
        utils.testUnixServerCb(serverList[1].addr, serverList[1].port, function(state2122){
            utils.testUnixServerCb(serverList[2].addr, serverList[2].port, function(state2123){
                utils.testUnixServerCb(serverList[3].addr, serverList[3].port, function(state2124){
                    utils.testUnixServerCb(serverList[4].addr, serverList[4].port, function(state2110){
                        var arr = new Array();
                        var map = new Map();
                        map.set(serverList[0].port, state2121);
                        map.set(serverList[1].port, state2122);
                        map.set(serverList[2].port, state2123);
                        map.set(serverList[3].port, state2124);
                        map.set(serverList[4].port, state2110);
    
                        for (let index = 0; index < serverList.length; index++) {
                            var element = serverList[index];
                            element.state = map.get(element.port);
                            arr.push(element);
                        }
                        utils.testUnixServerMsg('192.168.1.17', 2124, "SSH-2.0-PUTTY");
                        return cb(arr);
                    });
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
        ret.topData = backConf.homeTopNumber;
        return cb(ret);
    });
};