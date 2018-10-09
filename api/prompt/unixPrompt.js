'use strict';
const readline = require('readline')
const blank = '\n'.repeat(process.stdout.rows)

const clearRoutine = require('../routine/clearRoutine')
const statCtrl = require('../controllers/statController')

class UnixPrompt {
  constructor(){
  }

  get parser(){
    return 'unix'
  }

  exec(){
    var listLog = statCtrl.getLogConsole();
    clearRoutine.exec();
    listLog.forEach(element => {
      //{port, time, ip}
      console.log('port['+element.port+'] time['+element.time+']ip['+element.ip+']')
    })
    console.log('Request ['+listLog.length+']')
  }
};
const unix_prompt = new UnixPrompt();
module.exports = unix_prompt;