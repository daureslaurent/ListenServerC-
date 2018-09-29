'use strict';
/* Virtual controller */

var graphController = require('../../web/controllers/graphControllers');
var dataController = require('./dataController');
var ipController = require('./ipController');


var cache;



exports.testCache = function(data){
  console.log("cache: "+cache);
  cache = data;
  console.log("Endcache: "+cache);
};

var calculTime = function(time){
    var now = new Date().getTime();
    return now - time;
}
var cacheTimeShort = 10 * 60 * 1000;
var cacheTimeLong = 40 * 60 * 1000;

var cacheDayHour;
exports.getPortByHour = function(){
    return new Promise(function(resolve, reject) {
        if (!cacheDayHour || calculTime(cacheDayHour.time) > cacheTimeLong){
            var timeStampStart = new Date().getTime();
            graphController.typeByHour().then(function(data){
                console.log('data')
                data.timeProc = calculTime(timeStampStart);
                cacheDayHour = {data: data, time: new Date().getTime()};
                resolve(data);
            });
        }
        else resolve(cacheDayHour.data);
    });
};

var cacheLast24;
exports.getLast24Port = function(){
    return new Promise(function(resolve, reject) {
        if (!cacheLast24 || calculTime(cacheLast24.time) > cacheTimeShort){
            var timeStampStart = new Date().getTime();
            graphController.last24H().then(function(data){
                data.timeProc = data.timeProc = calculTime(timeStampStart);
                cacheLast24 = {data: data, time: new Date().getTime()};
                resolve(data);
            });
        }
        else
        resolve(cacheLast24.data);
    });
};

exports.getCountByIp = function(){
    var converterToList = function(map){
        return new Promise(function(resolve, reject){
            var finalList = new Array();
            map.forEach(function (item, key, mapObj) {
                finalList.push({ip: key, nb: item});
            });
            resolve(finalList);
        });
    };

    return new Promise(function(resolve, reject){
        getCountByIpRawMap()
        .then(converterToList)
        .then(function(dataList){
            resolve(dataList);
        });
    });
}

var getCountByIpRawMap = function(){
    var inputConverter = function(dataArray){
        return new Promise(function(resolve, reject){
            var datas = new Array();
            for (let index = 0; index < dataArray.length; index++) {
                datas = datas.concat(dataArray[index]);
            }
            resolve(datas);
        });
    };

    var fillInMap = function(data){
        return new Promise(function(resolve, reject){
            var map = new Map();
            for (let index = 0; index < data.length; index++) {
                var elem = data[index];
                var dataMap = map.get(elem.ip);
                if (dataMap == undefined){
                    map.set(elem.ip, 1);
                }
                else {
                    map.set(elem.ip, dataMap+1);
                }
            }
            resolve(map);
        });
    };

    return new Promise(function(resolve, reject){
        dataController.getAllDataActivePromise(dataController)
        .then(inputConverter)
        .then(fillInMap)
        .then(function(dataMap){
            resolve(dataMap);
        })
    });
};

/* ======================== stat By Country ======================== */
exports.getCountByCountryForGraph = function(){
    

    var converterToList = function(map){
        return new Promise(function(resolve, reject){
            var arrayLabels = new Array();
            var arraydata = new Array();
            map.forEach(function (item, key, mapObj) {

                arrayLabels.push(key+'['+item+']');
                arraydata.push(item);
            });
            resolve({"labels":arrayLabels,"data":arraydata,"timeProc":49});
        });
    };

    return new Promise(function(resolve, reject){
        getCountByCountryRawMap()
        .then(converterToList)
        .then(function(dataList){
            resolve(dataList);
        });
    });

};

exports.getCountByCountry = function(){
    var converterToList = function(map){
        return new Promise(function(resolve, reject){
            var finalList = new Array();
            map.forEach(function (item, key, mapObj) {
                finalList.push({ip: key, nb: item});
            });
            resolve(finalList);
        });
    };

    return new Promise(function(resolve, reject){
        getCountByCountryRawMap()
        .then(converterToList)
        .then(function(dataList){
            resolve(dataList);
        });
    });
}

var getCountByCountryRawMap = function(){
    var preConverter = function(ipArray){
        return new Promise(function(resolve, reject){
            var datas = new Array();
            for (let index = 0; index < ipArray.length; index++) {
                datas = datas.concat(ipArray[index]);
            }
            resolve(datas);
        });
    };

    var inputConverter = function(data){
        return new Promise(function(resolve, reject){
            var map = new Map();
            for (let index = 0; index < data.length; index++) {
                var country = data[index].location.country;
                var dataMap = map.get(country);
                if (dataMap == undefined){
                    map.set(country, 1);
                }
                else {
                    map.set(country, dataMap+1);
                }
            }
            resolve(map);
        });
    };

    return new Promise(function(resolve, reject){
        ipController.getAllIp()
        .then(preConverter)
        .then(inputConverter)
        .then(function(dataMap){
            resolve(dataMap);
        })
    });
};
