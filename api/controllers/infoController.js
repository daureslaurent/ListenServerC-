'use strict';
/* Virtual controller */

var graphController = require('../../web/controllers/graphControllers');
var dataController = require('./dataController');
var ipController = require('./ipController');

/* ========================== LogContainer ========================== */
var arrayLog = new Array();
exports.addLogConsole = function(element){
    arrayLog.push(element);
}
exports.getLogConsole = function(number){
    var endLog = new Array();
    if (number === -1){
        number = arrayLog.length;
    }
    var i = 0;
    arrayLog.forEach(element =>{
        if (i < number){
            endLog.push(element);
        }
        i++;
    })
    return endLog
};

var cacheDbState = false;
exports.setStateDataBase = function(state){
    cacheDbState = state;
};
exports.getStateDataBase = function(){
    return cacheDbState;
}
