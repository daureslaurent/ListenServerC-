'use strict';
/* Virtual controller */

var graphController = require('../../web/controllers/graphControllers');


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