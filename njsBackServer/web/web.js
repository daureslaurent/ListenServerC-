'use strict';
var validator = require('validator');
var psTree = require('ps-tree');                
var exec = require('child_process').exec;

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
                
                var kill = function (pid, signal, callback) {
                    signal   = signal || 'SIGKILL';
                    callback = callback || function () {};
                    var killTree = true;
                    if(killTree) {
                        psTree(pid, function (err, children) {
                            [pid].concat(
                                children.map(function (p) {
                                    return p.PID;
                                })
                            ).forEach(function (tpid) {
                                try { process.kill(tpid, signal) }
                                catch (ex) { }
                            });
                            callback();
                        });
                    } else {
                        try { process.kill(pid, signal) }
                        catch (ex) { }
                        callback();
                    }
                };
                var child = exec('sudo ./doLaunchScriptServer.sh 2121');
                var childPid = child.pid;
                console.log('Server launch['+childPid+']');
                //Store pid in bd

                /*child.stdout.on('data', function(data) {
                    console.log('stdout: ' + data);
                });
                child.stderr.on('data', function(data) {
                    console.log('stdout: ' + data);
                });*/
                child.on('close', function(code) {
                    //TODO: chnge state in db
                    console.log('closing code: ' + code);
                });
                setTimeout(function(pid){
                    console.log('close pid['+pid+']');
                    kill(pid);
                }, 20000, childPid);
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