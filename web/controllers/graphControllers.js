'use strict';
var graphConvert = require('../../api/converter/graphConverter');

exports.last24H = function(){
    return new Promise(function(resolve, reject) {
        var option = {timeDiff : 24*60*60, precision: 25*60 };
        graphConvert.getLastUsageAllServerCb(option, function(lastGraph){
            resolve(lastGraph);
        });
    });
}

exports.typeByHour = function(){
    return new Promise(function(resolve, reject) {
        graphConvert.getGraphDayDataCallBack(function(data){
            resolve(data);
        });
    });
}

exports.dotByType = function(){
    return new Promise(function(resolve, reject) {
        graphConvert.getPercentPortCallBack(function(data){
            resolve(data);
        });
    });
}

exports.timeActivityServer = function(diffMin, diffHour, preciMin, preciHour, serverId){
    return new Promise(function(resolve, reject) {
        var min = diffMin * (60);
        var hour = diffHour * (60*60);
        var timeDiff = min+hour;
        var pmin = preciMin * (60);
        var phour = preciHour * (60*60);
        var precision = pmin+phour;
        graphConvert.getPercentPortCallBack(function(data){
            var option = {timeDiff : timeDiff, precision: precision };
            graphConvert.getLastUsageServerCb(serverId, option, function(dataEnd){
                resolve(dataEnd);
            });
        });
    });
}
