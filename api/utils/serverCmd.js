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
        console.log(server.port);
        var child = exec('sudo ./autoBackLauncher.sh '+port);
        var childPid = child.pid;
        serverCtrl.setPIDServer(childPid, id);
        console.log('Server launch PID['+childPid+'] PORT['+port+']');
        child.on('close', function(code) {
            //TODO: chnge state in db
            serverCtrl.setPIDServer('-1', id);
            console.log('closing code: ' + code);
        });
        child.stdout.on('data', function(data) {
                    console.log('stdout: ' + data);
                });
                child.stderr.on('data', function(data) {
                    console.log('stdout: ' + data);
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