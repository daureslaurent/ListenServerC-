'use strict';

var process = require('./graphProcess');
var dataCtrl = require('../controllers/dataController');
var hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 
    20, 21, 22, 23, 24];

exports.getGraphDayDataCallBack = function(cb){
    var timeStampStart = new Date().getTime();
    var portlist = null;
    dataCtrl.getAllData(function(dataList){
        process.doProcessDayDataCB(dataList, portlist, function(mapPort){
            var retArray = new Array();
            

            mapPort.forEach(function(valeur, cle) {
                var port = cle;
                var tmpArray = new Array();
                for (let index = 0; index < hours.length; index++) {
                    tmpArray.push(valeur.get(hours[index]));
                }
                retArray.push(tmpArray);
                //valeur.forEach(function(valeur, clé) {
                //    console.log(clé + " = " + valeur);
                //  });
            });

            /*for (let index = 0; index < hours.length; index++) {
                endArray.push(map.get(hours[index]));
            }*/
            var ret = {labels: hours, data: retArray}
            var timeStampEnd = new Date().getTime();
            console.log('process_Convert_DayData time: '+(timeStampEnd-timeStampStart));
            //console.log(ret);
            cb(ret);
        });
    })
};