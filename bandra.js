const request = require("request");
function sendAvailability() {
  var headers = {
      'Content-Type': 'application/json'
  };
  var options = {
      method: 'POST',
      url: 'http://192.168.31.133:3000/remoteApp',
      headers: headers,
      body: JSON.stringify({ 'deviceId': 'bandra' })
  };
  
  console.log("Sending Availability");
  request(options, function (error, response, body) {
      if (error){
        console.log(error.message);
        clearInterval(interval);  
      }else{
        console.log(response.body);
        if (response.body != "") {
          clearInterval(interval);
        }
      }
    });
}
var interval = setInterval(sendAvailability, 5000);

sendAvailability();

process.on('SIGINT', function () {
  console.log('Shutting down client');
  clearInterval(interval);
  process.exit();
})
