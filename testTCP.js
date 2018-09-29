var net = require('net');

var msg = "{\"ip\": \"1.1.1.1\",\"port\": \"2123\",\"time\": \"1536512860\",\"data\": \"SEVBRCAvIEhUVFAvMS4xDQpIb3N0OiAyLjcuMi43Mw0KQ29ubmVjdGlvbjogY2xvc2UNClVzZXItQWdlbnQ6IE1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDYuMSkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzM2LjAuMTk4NS4xMjUgU2FmYXJpLzUzNy4zNg0KDQo=\"}";
//var msg = "{\"ip\": \"1.1.1.1\",\"port\": \"2121\",\"time\": \"1536512860\",\"data\": \"SEVBRCAvIEhUVFAvMS4xDQpIb3N0OiAyLjcuMi43Mw0KQ29ubmVjdGlvbjogY2xvc2UNClVzZXItQWdlbnQ6IE1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDYuMSkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzM2LjAuMTk4NS4xMjUgU2FmYXJpLzUzNy4zNg0KDQo=\"}{\"ip\": \"1.1.1.1\",\"port\": \"2121\",\"time\": \"1536512860\",\"data\": \"dDMgMTIuMS4yCkFTOjIwNDgKSEw6MTkKCg==\"}";
//var msg = "16/9 - 23:25:48>:Recv :[]}";

// creating a custom socket client and connecting it....
var client  = new net.Socket();
client.connect({
  port:2120
});

client.on('connect',function(){
  console.log('Client: connection established with server');

  console.log('---------client details -----------------');
  var address = client.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log('Client is listening at port' + port);
  console.log('Client ip :' + ipaddr);
  console.log('Client is IP4/IP6 : ' + family);


  // writing data to server
  client.write(msg);

});

client.setEncoding('utf8');

client.on('data',function(data){
  console.log('Data from server:' + data);
});

setTimeout(function(){
  client.end('Bye bye server');
},5000);

//NOTE:--> all the events of the socket are applicable here..in client...


// -----------------creating client using net.connect instead of custom socket-------

// server creation using net.connect --->
// u can also => write the below code in seperate js file
// open new node instance => and run it...


const clients = net.connect({port: 2222}, () => {
  // 'connect' listener
  console.log('connected to server!');
  clients.write('world!\r\n');
});
clients.on('data', (data) => {
  console.log(data.toString());
  clients.end();
});
clients.on('end', () => {
  console.log('disconnected from server');
});