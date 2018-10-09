'use strict';
const readline = require('readline')

const blank = '\n'.repeat(process.stdout.rows)

//Modules prompts
const pr_unix = require('./unixPrompt');
const pr_menu = require('./menuPromp.js');
var term = require( 'terminal-kit' ).terminal;

class MenuManager {
  constructor(){    
  }

  run(){
    term.clear();
    pr_menu.exec();
    /*function startMenu() {

      }
      setTimeout(startMenu, 1500);*/

  }
};
module.exports = MenuManager;