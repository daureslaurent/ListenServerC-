'use strict';
module.exports = function(app) {
    var path = require('path');
    var dataConverter = require('./../api/converter/dataConverter');

    app.set('views', path.join(__dirname, '/view'));
    
    app.set('css', path.join(__dirname, '/css'));
    app.set('view engine', 'ejs');

    app.get('/web', function(req, res){
        dataConverter.getAllDataSummary(function(data){
            console.log("getAllDataSummary{"+JSON.stringify(data)+"}");
            console.log("count: "+data.count);
            //res.render('home', { players: playersList })
        });
    });

    /*aapp.get('/web/detail', function(req, res){
        var id = req.query.id;
        playerCtrl.getPlayerIdCallBack(id, function(playerFound){
            res.render('detail', { player: playerFound })
        });
    });

    app.get('/web/detail/weather', function(req, res){
        var id = req.query.id;
        var state = req.query.state;
        var redirect = '/web/detail?id='+id;
        featuresCtrl.set_player_weather_color(id, state);
        res.redirect(redirect);
    });*/

    console.log('Web loaded');
};