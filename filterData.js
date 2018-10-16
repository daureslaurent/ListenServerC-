var base64 = require('base-64');
var obj = require("./dataBase.json");

console.log(obj.length)

var httpCount = 0;
var sshCount = 0;
var filterType = function(req){
    var decodedData = base64.decode(req.data);
    //HTTP
    if (decodedData.includes("GET") || decodedData.includes("HTTP")){
        httpCount++
        
    }
    else if (decodedData.includes("SSH")) {
        //console.log('['+decodedData+']');
        sshCount++
    }
    else if (decodedData.includes("SIP")) {
        //console.log('['+decodedData+']');
        sshCount++
    }
    else if (decodedData.includes("Gh0st­")) {
        console.log(JSON.stringify(req))
        console.log('Gh0st­['+decodedData+']');

    }
    else {
        console.log('['+decodedData.trim()+']');
    }
    
}

var timeStampStart = new Date().getTime();

obj.forEach(function(listData) {
    console.log(listData.length)
    listData.forEach(function(req){
        filterType(req);
    })
});