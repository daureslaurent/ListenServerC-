'use strict';
//var dataConverter = require('./../api/converter/dataConverter');
var graphConvert = require('../../api/converter/graphConverter');
//var backConf = require('../config/webDisp.json');

module.exports = function(app) {
    var pathRoute = '/web/api/';
    var cacheTimeShort = 10 * 60 * 1000;
    var cacheTimeLong = 40 * 60 * 1000;

    var cacheLast24;
    app.get(pathRoute + 'graph/last24', function(req, res){
        var nowTime = new Date().getTime();
        
        if (cacheLast24 != null && cacheLast24 !== undefined  && (nowTime - cacheLast24.time) < cacheTimeShort){
            console.log((nowTime - cacheLast24.time))
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
            });
        }
    });

    var cacheDayHour;
    app.get(pathRoute + 'graph/dayhour', function(req, res){
        var nowTime = new Date().getTime();
        
        if (cacheDayHour != null && cacheDayHour !== undefined  && (nowTime - cacheDayHour.time) < cacheTimeLong){
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
        
        if (cachedotByHour != null && cachedotByHour !== undefined  && (nowTime - cachedotByHour.time) < cacheTimeLong){
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

    app.get(pathRoute + 'graph/server/time_activity', function(req, res){
        var timeStampStart = new Date().getTime();
        var serverId = req.query.serverId;
        var timeDiff = 10 *60*60;
        var precision = 5*60;
        if (req.query.m != undefined && req.query.h != undefined){
            var min = req.query.m * (60);
            var hour = req.query.h * (60*60);
            timeDiff = min+hour;
            if (req.query.pm != undefined && req.query.ph != undefined){
                var pmin = req.query.pm * (60);
                var phour = req.query.ph * (60*60);
                precision = pmin+phour;
            }
        }
        var option = {timeDiff : timeDiff, precision: precision };
        graphConvert.getLastUsageServerCb(serverId, option, function(data){
            var timeStampEnd = new Date().getTime();
            data.timeProc = (timeStampEnd-timeStampStart);
            res.send(data);
        });
    });

}