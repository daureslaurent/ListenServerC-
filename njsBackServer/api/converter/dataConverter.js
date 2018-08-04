'use strict';

var validator = require('validator');
var base64 = require('base-64');
var dataCtrl = require('../controllers/dataController');

exports.getAllDataSummary = function(cb){
    dataCtrl.countAllDataCallBack(function(count){
        dataCtrl.getCountByPortCallBack(2122, function(count2121){
            dataCtrl.getAllData(function(datas){
                var result = {};
                result.count = count;
                result.count2121 = count2121;
                result.data = datas;
                for (let index = 0; index < result.data.length; index++) {
                    const encodedData = result.data[index].data;
                    result.data[index].data = validator.escape(base64.decode(encodedData));
                    //console.log('encodedData['+index+']['+encodedData+']');

                    var unix_timestamp = result.data[index].time;
                    var date = new Date(unix_timestamp*1000);
                    var hours = date.getHours();
                    var minutes = "0" + date.getMinutes();
                    var seconds = "0" + date.getSeconds();
                    var day = "0"+date.getDay();
                    var month = "0"+(date.getMonth()+1);

                    var formattedTime = day.substr(-2) +'/'+month.substr(-2) + ' = ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                    result.data[index].timeStr = formattedTime;
                    result.data[index].time = null
                }
                cb(result);
            });
            //console.log('datas['+datas+']');
        });

    });
};

