'use strict';
const readline = require('readline')
const blank = '\n'.repeat(process.stdout.rows)

//Modules prompts
const pr_unix = require('./unixPrompt');

class PromptCustom {
  constructor(){

    this.listPrompts = [pr_unix];
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.recursiveAsyncReadLine = function () {
        rl.prompt()
      rl.question('', function (answer) {
        this.listPrompts.forEach(element => {
            if (answer === element.parser)
            element.exec();
        });
        

        if (answer === 'clear')
            this.clear()

        
        else if (answer == 'exit') //we need some base case, for recursion
          return rl.close(); //closing RL and returning from function.
        else {
            console.log(answer)
        }

        this.recursiveAsyncReadLine(); //Calling this function again to ask new question
      }.bind(this));
    }.bind(this);
    
  }

  run(){
    this.recursiveAsyncReadLine(); //we have to actually start our recursion somehow
  }

  clear(){
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
  }



};
module.exports = PromptCustom;