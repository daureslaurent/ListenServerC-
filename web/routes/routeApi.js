'use strict';

var graphController = require('../controllers/graphControllers');
var dataController = require('../../api/controllers/dataController');
var serverController = require('../../api/controllers/serverController');
var virtualStat = require('../../api/controllers/statController');

module.exports = function(app) {
    var pathRoute = '/web/api/';
    var cacheTimeShort = 10 * 60 * 1000;
    var cacheTimeLong = 40 * 60 * 1000;

    //{"data": data, time: 1537811824430}
    var calculTime = function(time){
        var now = new Date().getTime();
        return now - time;
    }

    /* ===================== LAST24 ===================== */
    app.get(pathRoute + 'graph/last24', function(req, res){
        virtualStat.getLast24Port().then(function(data){res.send(data)});
    });

    /* ===================== typeByHour ===================== */
    app.get(pathRoute + 'graph/dayhour', function(req, res){
        virtualStat.getPortByHour().then(function(data){res.send(data)});
    });

    /* ===================== DotByType ===================== */
    var cachedotByHour;
    app.get(pathRoute + 'graph/dotByHour', function(req, res){
        if (!cachedotByHour || calculTime(cachedotByHour.time) > cacheTimeLong){
            var timeStampStart = new Date().getTime();
            graphController.dotByType().then(function(data){
                //console.log("graph[dotByType] Finished");
                var timeStampEnd = new Date().getTime();
                data.timeProc = (timeStampEnd-timeStampStart);
                cachedotByHour = {data: data, time: timeStampEnd};
                res.send(data)
            });
        }
        else
            res.send(cachedotByHour.data);
    });

    /* ===================== serverDetailed ===================== */
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

        /* ===================== exportDataByPort ===================== */
    app.get(pathRoute + 'data/talk_all', function(req, res){
        var timeStampStart = new Date().getTime();
        serverController.getListIpServer().then(function(ips){
            var promiseArray = new Array();
            for (let index = 0; index < ips.length; index++) {
                promiseArray.push(dataController.getAllDataByPortPromise(ips[index], dataController));
            }
            return Promise.all(promiseArray).then(values => {
                console.log('export: '+(new Date().getTime()-timeStampStart));
                res.send(values);
                virtualStat.testCache("toto");
            })
        }, function(err){console.log(err)})
    });
};