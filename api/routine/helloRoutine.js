'use strict';
const readline = require('readline')
const blank = '\n'.repeat(process.stdout.rows)

class HelloRoutine {
  constructor(){

  }
  exec(){
    console.log("HelloRoutine");
  }
};
const helloRoutine = new HelloRoutine();
module.exports = helloRoutine;