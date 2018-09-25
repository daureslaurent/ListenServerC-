'use strict';
var validator = require('validator');
var utils = require('../api/utils/utils');
var express = require('express');
var serverCtrl = require('../api/controllers/serverController');
var dataCtrl = require('../api/controllers/dataController');
var serverCmd = require('../api/utils/serverCmd');

module.exports = function(app) {
    var path = require('path');
    var dataConverter = require('./../api/converter/dataConverter');
    var graphConvert = require('../api/converter/graphConverter');
    var backConf = require('../config/webDisp.json');
    
    app.set('views', path.join(__dirname, '/view'));
    console.log(__dirname)
    app.use('/web', express.static(__dirname + '/view/'));
    //app.use('/css', path.join(__dirname, '/web/css'));
    app.set('view engine', 'ejs');

    app.get('/web', function(req, res){
        dataConverter.getAllDataSummary(backConf.homeTopNumber, function(data){
            dataConverter.recurciveUnixTest(function(servers){
                dataConverter.getBackState(function(backData){
                    res.render('home', { dataList: data , serverList: servers, backState : backData})
                    console.log(data)
                });
            });
        });
    });

    app.get('/web/detail', function(req, res){
        dataConverter.getAllDataSummary(0, function(data){
            res.render('detail', { dataList: data });
        });
    });

    app.get('/web/graph', function(req, res){
        var timeStampStart = new Date().getTime();
        var timeStampEnd = new Date().getTime();
        res.render('graph', {genTime: (timeStampEnd-timeStampStart)});
    });

    app.get('/web/server/:id/state', function(req, res){
        if (req.query.state){
            var id = req.params.id;
            var state = (req.query.state == 'true');
            if (state)
                serverCmd.startServer(id);
            else
                serverCmd.stopServer(id);
        }
        res.json('{"msg": "OK"}');
    });

    app.get('/web/server/:id/color', function(req, res){
        if (req.query.color){
            var color = req.query.color;
            var id = req.params.id;
            serverCtrl.setColorServer(color, id);
            res.json("OK");
        }
    });

    app.get('/web/server', function(req, res){
        var timeStampStart = new Date().getTime();
        dataConverter.recurciveUnixTest(function(servers){
            if (req.query.addr){
                var addr = req.query.addr;
                var name = req.query.name;
                var port = req.query.port;
                var redirect = req.query.redirect;
                console.log('CreateServer['+addr+']['+name+']['+port+']['+redirect+']');
                serverCtrl.createServer(addr, name, port, redirect);
                dataCtrl.createData(data);
                res.render('server', { serverList: servers });
            }
            else if (req.query.todel){
                var id = req.query.todel;
                serverCtrl.deleteServer(id);
                res.render('server', { serverList: servers });
            }
            else if (req.query.serverId){
                var serverId = req.query.serverId;
                serverCtrl.getServerByIdCb(serverId, function(dataNAN){
                    var data = dataNAN[0];
                    dataConverter.getDataByPortLimitCallBack(data.port, 5, function(dataList){
                        serverCmd.getLogUnixServer(data.port, function(logUnix){
                            utils.testUnixServerCb(data.ip, data.port, function(state){
                                if (state){
                                    utils.getLogServerUnix(data.ip, data.port, function(log){
                                        utils.getVersionServerUnix(data.ip, data.port, function(version){
                                            var gentTime =((new Date().getTime())-timeStampStart);
                                            res.render('serverControl', { dataList: dataList, serverData: data, serverState: state, serverLog: log, unixLog: logUnix, serverVersion: version, genTime: gentTime });
                                        })
                                    });
                                }
                                else {
                                    var gentTime =((new Date().getTime())-timeStampStart);
                                    res.render('serverControl', { dataList: dataList, serverData: data, serverState: state, serverLog: 'NO CONNECTION', unixLog: logUnix, serverVersion: 'undefined', genTime: gentTime });
                                }
                            });
                        });
                    });
                });
            }
            else {
                res.render('server', { serverList: servers });
            }
        });
    });

    app.get('/web/search', function(req, res){
        if (req.query.port && validator.isIP(req.query.port)){
            var ip = req.query.port;
            dataConverter.getDataByIpCallBack(ip, function(data){
                return res.render('search', { dataList: data });
            });
        }
        else {
            var port = Number(req.query.port);
            if (!req.query.port ||!validator.isNumeric(req.query.port))
                port = 0;
            dataConverter.getDataByPortCallBack(port, function(data){
                return res.render('search', { dataList: data });
            });
        }
    });

    //Set WEB API
    var webApi = require('./routes/routeApi.js');
    webApi(app);

    console.log('Web loaded');
};