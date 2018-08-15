'use strict';
var serverList = require('../../config/server.json').serverList;
var base64 = require('base-64');
var serverConf = require('../../config/server.json');

var serverCtrl = require('../controllers/serverController');
var psTree = require('ps-tree');                
var exec = require('child_process').exec;

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

exports.unixToTimeStr = function(timeUnix){
  var date = new Date(timeUnix*1000);
  return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
};

exports.startServer = function(id){
    serverCtrl.getServerByIdCb(id, function(server){
        var port = server[0].port;
        var child = exec('sudo ./autoBackLauncher.sh '+port);
        var childPid = child.pid;
        serverCtrl.setPIDServer(childPid, id);
        console.log('Server launch PID['+childPid+'] PORT['+port+']');
        child.on('close', function(code) {
            serverCtrl.setPIDServer('-1', id);
            //console.log('closing code: ' + code);
        });
        child.stdout.on('data', function(data) {
                   // console.log('stdout: ' + data);
                });
                child.stderr.on('data', function(data) {
                    console.log('stderr: ' + data);
        });
    })
}

exports.stopServer = function(id){
    serverCtrl.getServerByIdCb(id, function(server){
        var pid = server[0].pid;
        console.log('PID to close: '+pid);
        if (pid != '-1')
            kill(pid);
        serverCtrl.setPIDServer('-1', id);
    })
}

exports.getLogUnixServer = function(port, cb){
    var fs = require('fs');
    var path = 'out'+port+'/logServer/outLog-'+port+'.txt';
    console.log('path:'+path);
    fs.readFile(path, 'utf8', function(err, contents) {
        var sended = false;

        if (err){
            if (!sended){
                console.log('Err: '+err);
                sended = true;
                cb('Erreur');
            }
        }
        else {
            if (!sended){
                console.log('contents:'+contents);
                cb(contents);
                sended = true;
            }
        }
    });
};