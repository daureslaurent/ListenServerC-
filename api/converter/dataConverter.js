'use strict';

var dataCtrl = require('../controllers/dataController');
var utils = require('../utils/utils');
var backConf = require('../../config/webDisp.json');
var serverCtrl = require('../controllers/serverController');

exports.getAllDataSummary = function(limit, cb){
    dataCtrl.countAllDataCallBack(function(count){
        dataCtrl.getCountByPortCallBack(2122, function(count2121){
            dataCtrl.getAllDataLimit(limit, function(datas){
                utils.formatDataForWebCb(datas, function(end){
                    cb(end);
                })
            });
            //console.log('datas['+datas+']');
        });

    });
};

exports.recurciveUnixTest = function(cb){
    var finalCount = 0;
    var map = new Map();
    var serversList;
    //utils.testUnixServerMsg('192.168.1.17', 2121, 'log\n');

    var sendTestFunc = function(addr, port, cb){
        utils.testUnixServerCb(addr, port, function(state, key){
            return returnTestFunc(state, key, cb);
        });
    };

    var returnTestFunc = function(value, key, cb){
        console.log('t2: '+key)
        finalCount++;
        if (finalCount == serversList.length){
            map.set(key, value);
            var arr = new Array();
            for (let index = 0; index < serversList.length; index++) {
                var element = serversList[index];
                var fKey = element.addr+element.port;
                element.state = map.get(fKey);
                arr.push(element);
            }
            console.log('FINISH:'+arr)
            return cb(arr);
        }
        else {
            map.set(key, value);
        }
    };

    serverCtrl.getAllServerCb(function(servers){
        serversList = servers;
        if (servers.length === 0){
            for (let index = 0; index < serverList.length; index++) {
                sendTestFunc(serverList[index].addr, serverList[index].port, cb);
            }
        }
        for (let index = 0; index < servers.length; index++) {
            console.log('t1:'+servers[index].port)
            servers[index].addr = servers[index].ip;
            sendTestFunc(servers[index].ip, servers[index].port, cb);
        }
    })
};

exports.getInfosAdvancedServerUnixCb = function(addr, ip, cb){
    utils.getLogServerUnix(addr, port, function(log){
        return returnTestFunc(log, addr+port, cb);
    });
    utils.testUnixServerCb(addr, port, function(state, key){
        return returnTestFunc(state, key, cb);
    });
}

exports.getInfosServerUnixCb = function(serverList, cb){
    var finalCount = 0;
    var map = new Map();

    var sendTestFunc = function(addr, port, cb){
        utils.getLogServerUnix(addr, port, function(log){
            return returnTestFunc(log, addr+port, cb);
        });
    };
    var returnTestFunc = function(log, key, cb){
        finalCount++;
        if (finalCount == serverList.length){
            map.set(key, log);
            var arr = new Array();
            for (let index = 0; index < serverList.length; index++) {
                var element = serverList[index];
                var fKey = element.addr+element.port;
                element.log = map.get(fKey);
                arr.push(element);
            }
            return cb(arr);
        }
        else {
            if (log != 'close')
                map.set(key, log);
        }
    };
    
    for (let index = 0; index < serverList.length; index++) {
        sendTestFunc(serverList[index].ip, serverList[index].port, cb);
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
        utils.formatDataForWebCb(data, function(end){
            cb(end);
        });
    });
};

exports.getDataByIpCallBack = function(ip, cb){
    dataCtrl.getDataByIpCallBack(ip, function(data){
        utils.formatDataForWebCb(data, function(end){
            cb(end);
        });
    });
};

exports.getDataByPortLimitCallBack = function(port, limit, cb){
    dataCtrl.getDataByPortLimitCallBack(port, limit, function(data){
        utils.formatDataForWebCb(data, function(end){
            cb(end);
        });
    });
};