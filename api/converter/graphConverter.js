'use strict';

var utils = require('../utils/utils');
var process = require('./graphProcess');
var dataCtrl = require('../controllers/dataController');
var hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 
    20, 21, 22, 23, 0];

exports.getGraphDayDataCallBack = function(cb){
    var timeStampStart = new Date().getTime();

    var funcdoGraphDayPagging = function(mapPort, cb){
        var retArray = new Array();
        var portArray = new Array();
        var finalCount = 0;
        mapPort.forEach(function(valeur, cle) {
            //utils.getRedirectionCb(cle, function(rediPort){
                portArray.push(cle);
                var tmpArray = new Array();
                for (let index = 0; index < hours.length; index++) {
                    tmpArray.push(valeur.get(hours[index]));
                }
                retArray.push(tmpArray);
                finalCount++;
                if (finalCount == mapPort.size){
                    var ret = {labels: hours, name: portArray, data: retArray}
                    var timeStampEnd = new Date().getTime();
                    console.log('process_Convert_DayData time: '+(timeStampEnd-timeStampStart));
                    cb(ret);
                }
            //})
        });
    };

    
    dataCtrl.countAllDataCallBack(function(count){
        var curPage = 0;
        var paging = 500;
        var maxPage = count - 1;
        var tmpArr = new Array();
        var nbOccur = Math.ceil(maxPage/paging);
        var currOccur = 0;



        for (;curPage < maxPage; curPage += paging) {
            if (curPage+paging > maxPage){
                paging = maxPage - curPage;
                console.log('correction Paging['+paging+']')
            }
            console.log('S '+curPage+'/'+maxPage)
            dataCtrl.getAllDataSkipLimitCb(curPage, paging, function(data){
                currOccur++;
                tmpArr = tmpArr.concat(data);
                console.log(currOccur+'/'+nbOccur);
                console.log(tmpArr.length);
                if (currOccur >= nbOccur){
                    process.doProcessDayDataCB(tmpArr, function(mapPort){
                        funcdoGraphDayPagging(mapPort, cb);
                    });
                }
            });
        }
    });
};