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
                cb(utils.formatDataForWeb(datas));
            });
            //console.log('datas['+datas+']');
        });

    });
};

exports.recurciveUnixTest = function(cb){
    var finalCount = 0;
    var map = new Map();
    utils.testUnixServerMsg('192.168.1.17', 2122, 'log\n');

    var sendTestFunc = function(addr, port, cb){
        utils.testUnixServerCb(addr, port, function(state, key){
            return returnTestFunc(state, key, cb);
        });
    };

    var returnTestFunc = function(value, key, cb){
        finalCount++;
        if (finalCount == serverList.length){
            map.set(key, value);
            var arr = new Array();
            for (let index = 0; index < serverList.length; index++) {
                var element = serverList[index];
                var fKey = element.addr+element.port;
                element.state = map.get(fKey);
                arr.push(element);
            }
            return cb(arr);
        }
        else {
            map.set(key, value);
        }
    };

    for (let index = 0; index < serverList.length; index++) {
        sendTestFunc(serverList[index].addr, serverList[index].port, cb);
    }
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

exports.getDataByPortCallBack = function(port, cb){
    dataCtrl.getDataByPortCallBack(port, function(data){
        return cb(utils.formatDataForWeb(data));
    });
};