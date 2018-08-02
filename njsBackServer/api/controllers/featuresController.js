'use strict';
var mongoose = require('mongoose');

var Player = require('./playerController');
var PlayerMong = mongoose.model('Player');

var config = require('../config');
var weatherApi = require('../extCall/weatherApi')
var conv = require('color-temp');

exports.set_player_weather_color = function(id, state){
  PlayerMong.update({ _id: id }, { $set: { 'features.weatherColor': state }}, function(err, player){
    if (err)console.log('Change Weather err:'+err)
  } );
};

exports.set_feature_waves_bright = function(id, state){
  PlayerMong.update({ _id: id }, { $set: { 'features.waveBri': state }}, function(err, player){
    if (err)console.log('Change waves Brightness err:'+err)
  } );
};

exports.set_feature_stars = function(id, state){
  PlayerMong.update({ _id: id }, { $set: { 'features.stars': state }}, function(err, player){
    if (err)console.log('Change stars err:'+err)
  } );
};

exports.doWeatherBroadcoast = function(clientMqtt){
  Player.getPlayersCallBack(function(players){
    for (var i = 0, len = players.length; i < len; i++) {
      var player = players[i];
      if (player.isActivated && player.features.weatherColor){
        //Feature activated
        weatherApi.getCurrentWeatherByCityCallBAck('grenoble', function(currentCondition){
          if (currentCondition.tmp){
            var temperatureBase = currentCondition.tmp;
            var minTemp = 20;
            var maxTemp = 35 + minTemp;
            var temp =  minTemp + temperatureBase;
            var tmpMulti = (maxTemp - temp);

            var kelvinMinTemp = 0;
            var kelvinMaxTemp = 8000;
            var kelvinend = kelvinMaxTemp - kelvinMinTemp;
            
            var temperatureForKelvin = (kelvinend - ((temp*tmpMulti) * (kelvinend/(maxTemp*tmpMulti)))) + kelvinMinTemp;
            console.log('temp real: '+temperatureBase+' temp Modif: '+temp+' Kelvin: '+temperatureForKelvin);
            var rgb = conv.temp2rgb(temperatureForKelvin);
            var reqBuilder = "rgbf:"+ parseInt(rgb[0]) +'-'+parseInt(rgb[1])+'-'+parseInt(rgb[2]);
            clientMqtt.publish('ledlamp/ctrl', reqBuilder);
          }
        });
        console.log('feature weather broadcoast to '+player.name);
      }
    }
  });
}