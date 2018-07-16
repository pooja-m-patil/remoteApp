var iotf = require("ibmiotf");
var val;
var deviceId = 'd1111';

const request = require("request");
function sendAvailability() {
  var headers = {
    'Content-Type': 'application/json'
  };
  var options = {
    method: 'POST',
    url: 'http://192.168.31.133:3000/remoteApp',
    headers: headers,
    body: JSON.stringify({ 'deviceId': "d1111" })
  };

  console.log("Sending Availability");
  request(options, function (error, response, body) {
    if (error) {
      //console.log(error.message);
      clearInterval(pauseInterval);
    } else {
      console.log(response.body);
      var temp = JSON.parse(response.body);
      console.log(temp.Authentication_Token);
      if (response.body != "") {
        clearInterval(pauseInterval);
        if (response.body == "Not valid device") {
          process.exit();
        }
        var config = {
          "org": 'tgacg8',
          "id": 'd1111',
          "type": 'iotbootcamp',
          "auth-method": "token",
          "auth-token": temp.Authentication_Token
        };

        console.log(config);
        var deviceClient = new iotf.IotfDevice(config);

        deviceClient.connect();

        // if (response.body == "Pay your bill") {
        //   console.log("pay bill");
        //   deviceClient.disconnect();
        //   process.exit();

        // }
    }
  }
  });
}
var pauseInterval = setInterval(sendAvailability, 5000);

sendAvailability();

process.on('SIGINT', function () {
  console.log('Shutting down client');
  clearInterval(pauseInterval);
  process.exit();
})
