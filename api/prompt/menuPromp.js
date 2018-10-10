'use strict';
const readline = require('readline')
const blank = '\n'.repeat(process.stdout.rows)

const clearRoutine = require('../routine/clearRoutine')
const statCtrl = require('../controllers/statController')

const logs_menu = require('./logMenuPromp');
const db_menu = require('./dbMenu');

var term = require( 'terminal-kit' ).terminal ;
class MainMenu {
  constructor(){
    this.mapMenu = new Map();
    this.mapMenu.set('Logs', logs_menu);
    this.mapMenu.set('DataBase', db_menu);
    this.mapMenu.set('Exit', 'Exit');
  }

  get parser(){
    return 'menu'
  }

  exec(){
    
    var items = Array.from(this.mapMenu.keys());

    term.clear();
    term.cyan( 'Server Listener C++:\n' ) ;
    
    
    term.bgGray("============== MAIN MENU ==============\n");
    term.gridMenu( items , function( error , response ) {
      term.clear();
      if ('Exit' === response.selectedText){
        term.cyan('Server Listener C++:\n') ;
        console.log('Bye.');
        process.exit();
      }
      else {
        var elem = this.mapMenu.get(response.selectedText)
        if (elem != undefined && elem.exec){
          elem.exec()
        }
      }
    
    }.bind(this));
  }
};
const main_menu = new MainMenu();
module.exports = main_menu;