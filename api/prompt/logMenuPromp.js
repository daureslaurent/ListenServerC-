'use strict';
const statCtrl = require('../controllers/statController')
var term = require( 'terminal-kit' ).terminal ;



class MenuPromptLogs {
  constructor(){
  }
  exec(){
    var nameArr = new Array();
    var dataArr = new Array();
    var dataMap = new Map();
    var listLog = statCtrl.getLogConsole();

    listLog.forEach(element => {
      var name = 'IP['+element.ip+']:['+element.port+']'+element.time;
      nameArr.push(name)
      dataArr.push(element)
      dataMap.set(name, element);
    })
    nameArr.push('Return');
    var sizeLog = (!listLog.length)?'0':listLog.length;

    
    term.cyan("== Request [").green(sizeLog).cyan("]\n");    
    
    term.bgGrey("============== LOGS MENU ==============\n");    
    term.gridMenu( nameArr , function( error , response ) {
      if (response.selectedText === 'Return'){
        require('./menuPromp').exec();
      }
      else {
        var elem = dataMap.get(response.selectedText);
        term.clear();
        term.cyan('== Look Req\n');
        term.cyan('= IP [').magenta(elem.ip).cyan("]\n");
        term.cyan('= Port [').magenta(elem.port).cyan("]\n");
        term.cyan('= Time [').magenta(elem.time).cyan("]\n");
        term.cyan('= Data{b64} [').red(elem.data).cyan("]\n");
        this.exec();
      }
    }.bind(this));
  }
 
};
const pr_menu_logs = new MenuPromptLogs();
module.exports = pr_menu_logs;