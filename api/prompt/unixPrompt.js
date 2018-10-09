'use strict';

const statCtrl = require('../controllers/statController')

class UnixPrompt {
  constructor(){
  }

  get parser(){
    return 'unix'
  }

  exec(){
    var term = require( 'terminal-kit' ).terminal ;
    var listLog = statCtrl.getLogConsole();

    term.clear() ;
    listLog.forEach(element => {
      //{port, time, ip}
      term("port[").red(element.port)("] time[" ).green(element.time)("] ip[").blue(element.ip)("]\n");
    })
    var sizeLog = (!listLog.length)?'0':listLog.length;
    term.gray("Request [").red(sizeLog).gray("]\n");
  }
};
const unix_prompt = new UnixPrompt();
module.exports = unix_prompt;