var iotf = require("ibmiotf");
var val;


const request = require("request");
function sendAvailability() {
  var headers = {
      'Content-Type': 'application/json'
  };
  var options = {
      method: 'POST',
      url: 'http://192.168.31.133:3000/remoteApp',
      headers: headers,
      body: JSON.stringify({ 'deviceId': "d2222" })
  };
  
  console.log("Sending Availability");
  request(options, function (error, response, body) {
      if (error){
        //console.log(error.message);
        clearInterval(pauseInterval);  
      }else{
        console.log(response.body);
        var temp=JSON.parse(response.body);
        console.log(temp.Authentication_Token);
        if (response.body != "") {
          clearInterval(pauseInterval);
          if (response.body == "Not valid device") {
            process.exit();
          }
          var config = {
            "org" : 'tgacg8',
            "id" : 'd2222',
            "type" : 'iotbootcamp',
            "auth-method" : "token",
            "auth-token" : temp.Authentication_Token
          };
    
          console.log(config);
        var deviceClient = new iotf.IotfDevice(config);

        deviceClient.connect();

        deviceClient.on("connect", function () {

          setInterval(function(){

          var d = new Date();
           deviceClient.publish("status","json",'{"d" : { "deviceId" : "d2222" , "usage" :'+ Math.round(Math.random()*100)+', "time":'+JSON.stringify(d.toISOString())+'}}');
          },5000)
        })

        deviceClient.on("command", function (commandName,format,payload,topic) {
          var temp=JSON.parse(payload);
         console.log(temp);
         console.log(topic);
        // deviceClient.disconnect();
         //process.exit();
        // clearInterval(pauseInterval);
      });
      }
    }
    });
}
var pauseInterval = setInterval(sendAvailability, 5000);
//var stopConn=setInterval()

sendAvailability();

process.on('SIGINT', function () {
  console.log('Shutting down client');
  clearInterval(pauseInterval);
  process.exit();
})
