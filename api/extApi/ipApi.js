'use strict';
const axios = require('axios');

var mapData = new Map();

exports.getIpInfo = function(ip){
    return new Promise(function(resolve, reject) {
        var cachedData = mapData.get(ip)
        if (cachedData == undefined){
            console.log('DoReqIpInfo')
            axios.get('https://ipapi.co/'+ip+'/json/')
            .then(response => {
                var location = {
                    "country": response.data.country_name,
                    "city": response.data.city,
                    "region": response.data.region
                };
                mapData.set(ip, location);
                resolve(location);
            });
        }
        else {
            console.log('useCache')
            resolve(cachedData);
        }
    });
};