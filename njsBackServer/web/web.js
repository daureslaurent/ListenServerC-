'use strict';
var validator = require('validator');

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
                    //console.log(servers);
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

    app.get('/web/server', function(req, res){
        dataConverter.recurciveUnixTest(function(servers){
            if (req.query.teststart){
                //TODO: ADD LAUNCH SCRIPT
            }
            res.render('server', { serverList: servers });
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