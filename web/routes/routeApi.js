'use strict';
//var dataConverter = require('./../api/converter/dataConverter');
var graphConvert = require('../../api/converter/graphConverter');
//var backConf = require('../config/webDisp.json');

module.exports = function(app) {
    var pathRoute = '/web/api/';
    var cacheTime = 60 * 1000;

    var cacheLast24;
    app.get(pathRoute + 'graph/last24', function(req, res){
        var nowTime = new Date().getTime();
        
        if (cacheLast24 != null && cacheLast24 !== undefined  && (nowTime - cacheLast24.time) < cacheTime){
            console.log((nowTime - cacheLast24.time))
            console.log('from cache');
            res.send(cacheLast24.data);
        }
        else {
            var timeStampStart = new Date().getTime();
            var option = {timeDiff : 24*60*60, precision: 25*60 };
            graphConvert.getLastUsageAllServerCb(option, function(lastGraph){
                var timeStampEnd = new Date().getTime();
                lastGraph.timeProc = (timeStampEnd-timeStampStart);
                res.send(lastGraph);
                cacheLast24 = {time: nowTime, data: lastGraph};
                console.log('from live');
            });
        }
    });

    var cacheDayHour;
    app.get(pathRoute + 'graph/dayhour', function(req, res){
        var nowTime = new Date().getTime();
        
        if (cacheDayHour != null && cacheDayHour !== undefined  && (nowTime - cacheDayHour.time) < cacheTime){
            res.send(cacheDayHour.data);
        }
        else {
            var timeStampStart = new Date().getTime();
            graphConvert.getGraphDayDataCallBack(function(data){
                var timeStampEnd = new Date().getTime();
                data.timeProc = (timeStampEnd-timeStampStart);
                res.send(data);
                cacheDayHour = {time: nowTime, data: data};
            });
        }
    });


    var cachedotByHour;
    app.get(pathRoute + 'graph/dotByHour', function(req, res){
        var nowTime = new Date().getTime();
        
        if (cachedotByHour != null && cachedotByHour !== undefined  && (nowTime - cachedotByHour.time) < cacheTime){
            res.send(cachedotByHour.data);
        }
        else {
            var timeStampStart = new Date().getTime();
            graphConvert.getPercentPortCallBack(function(data){
                var timeStampEnd = new Date().getTime();
                data.timeProc = (timeStampEnd-timeStampStart);
                res.send(data);
                cachedotByHour = {time: nowTime, data: data};
            });
        }
    });

}