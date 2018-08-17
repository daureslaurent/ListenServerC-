'use strict'

exports.getLogServerUnix = function(addr, port, cb){
var key = addr+port;
var client = new net.Socket();

client.connect(port, addr, function() {
    var sended = false;

    client.on('data', function(data) {
    if (!sended){
        cb(data, key);
        sended = true;
    }
    //client.destroy();
    });

    // Add a 'close' event handler for the client socket
    client.on('close', function() {

    if (!sended){
        cb('close', key);
        sended = true;
    }
    //client.destroy();
    });
    client.write('log\n');
});

client.on('error', function(err) {
    cb('err', key);
    client.destroy();
});
};

exports.getVersionServerUnix = function(addr, port, cb){
var key = addr+port;
var client = new net.Socket();

client.connect(port, addr, function() {
    var sended = false;

    client.on('data', function(data) {
    if (!sended){
        cb(data, key);
        sended = true;
    }
    //client.destroy();
    });

    // Add a 'close' event handler for the client socket
    client.on('close', function() {

    if (!sended){
        cb('close', key);
        sended = true;
    }
    //client.destroy();
    });
    client.write('VERSION\n');
});

client.on('error', function(err) {
    cb('err', key);
    client.destroy();
});
};