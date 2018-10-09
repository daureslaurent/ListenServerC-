'use strict';
const readline = require('readline')
const blank = '\n'.repeat(process.stdout.rows)

class StatsRoutine {
  constructor(){

  }

  exec(){
    console.log("StatsRoutine");
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    console.log("CLEAR[StatsRoutine]");
  }
};
const statsRoutine = new StatsRoutine();
module.exports = statsRoutine;