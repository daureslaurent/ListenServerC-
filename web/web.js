'use strict';
var validator = require('validator');
var utils = require('../api/utils/utils');

var serverCtrl = require('../api/controllers/serverController');
var serverCmd = require('../api/utils/serverCmd');

module.exports = function(app) {
    var path = require('path');
    var dataConverter = require('./../api/converter/dataConverter');
    var backConf = require('../config/webDisp.json');
    app.set('views', path.join(__dirname, '/view'));
    
    app.set('css', path.join(__dirname, '/css'));
    app.set('view engine', 'ejs');

    app.get('/web', function(req, res){
        dataConverter.getAllDataSummary(backConf.homeTopNumber, function(data){
            dataConverter.recurciveUnixTest(function(servers){
                dataConverter.getBackState(function(backData){
                    res.render('home', { dataList: data , serverList: servers, backState : backData})
                });
            });
        });
    });

    app.get('/web/detail', function(req, res){
        dataConverter.getAllDataSummary(0, function(data){
            res.render('detail', { dataList: data });
        });
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

    app.get('/web/server', function(req, res){
        dataConverter.recurciveUnixTest(function(servers){
            if (req.query.addr){
                var addr = req.query.addr;
                var name = req.query.name;
                var port = req.query.port;
                var redirect = req.query.redirect;
                console.log('CreateServer['+addr+']['+name+']['+port+']['+redirect+']');
                serverCtrl.createServer(addr, name, port, redirect);
            }
            console.log('TO0');
            if (req.query.serverId){
                var serverId = req.query.serverId;
                serverCtrl.getServerByIdCb(serverId, function(dataNAN){
                    var data = dataNAN[0];
                    dataConverter.getDataByPortLimitCallBack(data.port, 20, function(dataList){
                        serverCmd.getLogUnixServer(data.port, function(logUnix){
                            utils.testUnixServerCb(data.ip, data.port, function(state){
                                if (state){
                                    utils.getLogServerUnix(data.ip, data.port, function(log){
                                        utils.getVersionServerUnix(data.ip, data.port, function(version){
                                            res.render('serverControl', { dataList: dataList, serverData: data, serverState: state, serverLog: log, unixLog: logUnix, serverVersion: version });
                                        })
                                    });
                                }
                                else {
                                    res.render('serverControl', { dataList: dataList, serverData: data, serverState: state, serverLog: 'NO CONNECTION', unixLog: logUnix, serverVersion: 'undefined' });
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

    console.log('Web loaded');
};