'use strict';
const readline = require('readline')

const blank = '\n'.repeat(process.stdout.rows)

//Modules prompts
const pr_unix = require('./unixPrompt');
const pr_menu = require('./menuPromp.js');

class PromptCustom {
  constructor(){


    this.listPrompts = [pr_unix, pr_menu];
  }

  run(){
    this.promiseRun = new Promise(function start(resolve, reject){
        console.log('Start Promise')

        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.stdoutMuted = true;

        //Open Question
        rl.question('', function (answer) {
            rl.close();
            this.listPrompts.forEach(element => {
                if (answer === element.parser)
                    return element.exec();
            });
            if (answer === 'clear'){
                this.clear()
                resolve();
            }
        }.bind(this));
    }.bind(this));


    this.promiseRun.then(function(){
        
        this.promiseRun.then(start);
    });
  }

  clear(){
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
  }



};
module.exports = PromptCustom;