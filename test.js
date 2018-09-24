const axios = require('axios');

axios.get('https://ipapi.co/'+'77.136.84.98'+'/json/')
.then(response => {
    var location = {
        "country": response.data.country_name,
        "city": response.data.city,
        "region": response.data.region
    };
    console.log(location);
    jsonData.location = location;
    console.log("ipInfo [OK]"+JSON.stringify(jsonData));
    dataCtrl.createData(jsonData); 
})
.catch(error => {
    console.log("ipInfo [KO]["+error+"]");
    dataCtrl.createData(jsonData); 
});