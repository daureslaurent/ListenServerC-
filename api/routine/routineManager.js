'use strict';
const routine_hello = require('./helloRoutine');
const routine_stats = require('./statRoutine');

class RoutineManager {
  //time in second
  constructor(time){
    //time to ms
    this.timeTick = time*1000;
    this.listRoutines = [routine_stats, routine_hello];
  }


  run(){
    console.log("RoutineManager started ...");
    console.log("RoutineManager [Time by tick]["+this.timeTick+"]");
    this.restart();
  }

  loop(){
    this.listRoutines.forEach(element => {
      element.exec();
    });
    this.restart();
  }

  restart(){
    setTimeout(function(){this.loop()}.bind(this), this.timeTick);
  }

};

module.exports = RoutineManager;