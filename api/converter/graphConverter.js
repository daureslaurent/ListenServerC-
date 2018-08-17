'use strict';

var utils = require('../utils/utils');
var process = require('./graphProcess');
var dataCtrl = require('../controllers/dataController');
var serverCtrl = require('../controllers/serverController');
var hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 
    20, 21, 22, 23, 0];

//Cache System
var dayGraphCache = null;

exports.getGraphDayDataCallBack = function(cb){
    
    //Cache System
    var funcCacheIntercept = function(dayGraph){
        //dayGraphCache = dayGraph;
        cb(dayGraph);
    }

    if (dayGraphCache != null){
        console.log('useCache!');
        return cb(dayGraphCache);
    }

    var funcdoGraphDayPagging = function(mapPort, cb){
        var retArray = new Array();
        var portArray = new Array();
        var finalCount = 0;
        mapPort.forEach(function(valeur, cle) {
            utils.getRedirectionCb(cle, function(rediPort){
                portArray.push(rediPort);
                var tmpArray = new Array();
                for (let index = 0; index < hours.length; index++) {
                    tmpArray.push(valeur.get(hours[index]));
                }
                retArray.push(tmpArray);
                finalCount++;
                if (finalCount == mapPort.size){
                    var ret = {labels: hours, name: portArray, data: retArray}
                    cb(ret);
                }
            });
        });
    };


    
    dataCtrl.countAllDataCallBack(function(count){
        var curPage = 0;
        var paging = 999;
        var maxPage = count - 1;
        var tmpArr = new Array();
        var nbOccur = Math.ceil(maxPage/paging);
        var currOccur = 0;

        for (;curPage < maxPage; curPage += paging) {
            if (curPage+paging > maxPage){
                paging = maxPage - curPage;
            }
            dataCtrl.getAllDataSkipLimitCb(curPage, paging, function(data){
                currOccur++;
                tmpArr = tmpArr.concat(data);;
                if (currOccur >= nbOccur){
                    process.doProcessDayDataCB(tmpArr, function(mapPort){
                        funcdoGraphDayPagging(mapPort, funcCacheIntercept);
                    });
                }
            });
        }
    });
};

exports.getPercentPortCallBack = function(cb){
    dataCtrl.countAllDataCallBack(function(count){
        serverCtrl.getAllServerCb(function(listServer){
            var nameArray = new Array();
            var dataArray = new Array();

            var totalCountData = count;
            var currCount = 0;
            for (let index = 0; index < listServer.length; index++) {
                const server = listServer[index];
                dataCtrl.getCountByPortCallBack(server.port, function(count){
                    utils.getRedirectionCb(server.port, function(rediPort){
                        currCount++;
                        nameArray.push(rediPort.substr(0, rediPort.indexOf(":")));
                        dataArray.push(Math.round((count/totalCountData)*100));
                        if (currCount >= listServer.length){
                            var ret = {labels: nameArray, data: dataArray}
                            cb(ret);
                        }
                    });
                })
            }
        });
    });
    
}

exports.getLastUsageServerCb = function(id, backTime, cb){
    serverCtrl.getServerByIdCb(id, function(serverList){
        var server = serverList[0];
       //GetDataByPort
        dataCtrl.getDataByPortCallBack(server.port, function(data){
            process.doLastUsageServerProcess(data, backTime, function(map){
                var labelArray = new Array();
                var dataArray = new Array();
                map.forEach(function(valeur, cle) {
                    labelArray.push(cle);
                    dataArray.push(valeur);
                });
                var endData = {labels: labelArray, data: dataArray};
                cb(endData);
            });
        });
    });
}
// option {timeDiff : 1*60*60, precision: 1*60 }
exports.getLastUsageAllServerCb = function(option, cb){
    var backTime = option.timeDiff;
    var precision = option.precision;
    serverCtrl.getAllServerCb(function(serverList){
        for (let index = 0; index < serverList.length; index++) {
            const server = serverList[index];
            var endLabelArray = new Array();
            var endDataArray = new Array();
            var count = 0;

            dataCtrl.getAllDataByPortCallBack(server.port, dataCtrl, function(data){
                console.log('OriDataSize:'+data.length)
                process.doLastUsageServerProcess(data, option, function(map){
                    count++;
                    var labelArray = new Array();
                    var dataArray = new Array();
                    map.forEach(function(valeur, cle) {
                        labelArray.push(cle);
                        dataArray.push(valeur);
                    });
                    endLabelArray.push(labelArray);
                    endDataArray.push(dataArray);
                    if (count == serverList.length){
                        //Convert label timestamp to date
                        var nameArray = new Array();
                        var listLabel = endLabelArray[0];
                        for (let index = 0; index < listLabel.length; index++) {
                            const timeElem = listLabel[index];
                            var timeStamp = (timeElem*Math.round(precision))*1000;
                            var date = new Date(timeStamp+ 7200);
                            var strDate = date.getHours()+''+date.getMinutes();
                            console.log(date.toString())
                            nameArray.push(strDate);
                        }
                        var endData = {labels: nameArray, data: endDataArray};
                        cb(endData);
                    }
                });
            });
        }
       //GetDataByPort

    });
}