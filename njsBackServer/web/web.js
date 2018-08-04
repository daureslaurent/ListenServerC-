'use strict';
module.exports = function(app) {
    var path = require('path');
    var dataConverter = require('./../api/converter/dataConverter');

    app.set('views', path.join(__dirname, '/view'));
    
    app.set('css', path.join(__dirname, '/css'));
    app.set('view engine', 'ejs');

    app.get('/web', function(req, res){
        dataConverter.getAllDataSummary(15, function(data){
            dataConverter.getStateServerUnix(function(servers){
                dataConverter.getBackState(function(backData){
                    console.log(JSON.stringify(data))
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

    console.log('Web loaded');
};