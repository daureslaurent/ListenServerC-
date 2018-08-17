'use strict';

exports.doProcessDayDataCB =  function(dataList, cb){
    var mapPort = new Map();
    var hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 
                20, 21, 22, 23, 0];
    //Init map with 0
    /*for (let index = 0; index < hours.length; index++) {
        map.set(hours[index], 0);
    }*/
    
    //Count Data by hours
    for (let index = 0; index < dataList.length; index++) {
        const element = dataList[index];
        var map = mapPort.get(element.port);
        if (map == undefined){
            //Init map
            var mapTmp = new Map();
            for (let i = 0; i < hours.length; i++) {
                mapTmp.set(hours[i], 0);
            }
            map = mapTmp;
            mapPort.set(element.port, mapTmp);
        }
        var date = new Date(element.time*1000);
        var hour = date.getHours();
        map.set(hour, map.get(hour) +1);
        mapPort.set(element.port, map);
    }
    cb(mapPort);
}

exports.doLastUsageServerProcess = function(data, option, cb){
    var backTime = option.timeDiff;
    var precision = option.precision;
    var diviseur = Math.round(/*1*1*60*/precision);
    var map = new Map();
    var maxTime = Math.round((Date.now()/1000)/ diviseur)//Math.round(data[0].time/ diviseur);
    //var minTime = Math.round(data[data.length-1].time/ diviseur);
    var minTime = Math.round(((Date.now()/1000) - backTime)/diviseur);

    //init map
    for (let index = minTime; index < maxTime; index++) {
        map.set(index, 0);
    }
    
    for (let index = 0; index < data.length; index++) {
        var preTime = data[index].time / diviseur
        if (preTime >= minTime && preTime <= maxTime){
            var time = Math.round(preTime);
            const elem = map.get(time);
            if (elem == undefined){
                map.set(time, 0);
            }
            map.set(time,  map.get(time)+1);
        }
    }
    cb(map);
}