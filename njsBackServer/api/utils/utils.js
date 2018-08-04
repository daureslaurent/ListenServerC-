'use strict';

exports.unixToTimeStr = function(timeUnix){
  var date = new Date(timeUnix*1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var day = "0"+date.getDay();
  var month = "0"+(date.getMonth()+1);

  return day.substr(-2) +'/'+month.substr(-2) + ' = ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
};