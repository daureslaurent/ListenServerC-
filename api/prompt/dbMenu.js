'use strict';
const infoCtrl = require('../controllers/infoController')
const dataCtrl = require('../controllers/dataController')
const ipCtrl = require('../controllers/ipController')
var term = require( 'terminal-kit' ).terminal ;
const config = require('../config')


class MenuDB {
  constructor(){
  }
  exec(){
    
    var stateDb = infoCtrl.getStateDataBase();
    var strState = (stateDb)?"OK":"FAIL";
    if (stateDb){
      term.cyan("== Databse State [").green(strState).cyan("]\n");
    } else {
      term.cyan("== Databse State [").red(strState).cyan("]\n");
    }

    dataCtrl.countDataPromise().then(function(count){
      term.cyan("= Request [").green(count).cyan("]\n");
      return ipCtrl.countIpPromise();
    }).then(function(count){
        term.cyan("= IP      [").green(count).cyan("]\n");
        this.showQuestion();
    }.bind(this));
  }

  showQuestion(){
    var items = ['Return'];

    term.bgGrey("============== LOGS MENU ==============\n");
    
    term.gridMenu( items , function( error , response ) {
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
const pr_menu_db = new MenuDB();
module.exports = pr_menu_db;