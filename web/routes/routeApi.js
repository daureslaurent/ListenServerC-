'use strict';

var graphController = require('../controllers/graphControllers.js');

module.exports = function(app) {
    var pathRoute = '/web/api/';
    var cacheTimeShort = 10 * 60 * 1000;
    var cacheTimeLong = 40 * 60 * 1000;

    var cacheLast24;
    app.get(pathRoute + 'graph/last24', function(req, res){
        var timeStampStart = new Date().getTime();
        graphController.last24H().then(function(data){
            //console.log("graph[last24] Finished");
            var timeStampEnd = new Date().getTime();
            data.timeProc = (timeStampEnd-timeStampStart);
            res.send(data)
        });
    });

    var cacheDayHour;
    app.get(pathRoute + 'graph/dayhour', function(req, res){
        var timeStampStart = new Date().getTime();
        graphController.typeByHour().then(function(data){
            //console.log("graph[typeByHour] Finished");
            var timeStampEnd = new Date().getTime();
            data.timeProc = (timeStampEnd-timeStampStart);
            res.send(data)
        });
    });


    var cachedotByHour;
    app.get(pathRoute + 'graph/dotByHour', function(req, res){
        var timeStampStart = new Date().getTime();
        graphController.dotByType().then(function(data){
            //console.log("graph[dotByType] Finished");
            var timeStampEnd = new Date().getTime();
            data.timeProc = (timeStampEnd-timeStampStart);
            res.send(data)
        });
    });

    app.get(pathRoute + 'graph/server/time_activity', function(req, res){
        var timeStampStart = new Date().getTime();

        var serverId = req.query.serverId;
        var diffMin = (req.query.m != undefined)?(req.query.m * (60)):0;
        var diffHour = (req.query.h != undefined)?(req.query.h * (60)):(10*(60));
        var preciMin = (req.query.pm != undefined)?(req.query.pm * (60)):(5*(60));
        var preciHour = (req.query.ph != undefined)?(req.query.ph * (60)):0;
        
        graphController.timeActivityServer(diffMin, diffHour, preciMin, preciHour, serverId)
        .then(function(data){
            //console.log("graph[timeActivityServer] Finished");
            var timeStampEnd = new Date().getTime();
            data.timeProc = (timeStampEnd-timeStampStart);
            res.send(data)
        });
    });
}