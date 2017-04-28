// Import the interface to Tessel hardware
var tessel = require('tessel');
var request = require('request');
var restify = require('restify');
var plugins = require('restify-plugins');
var climateLib = require('climate-si7020');
var servoLib = require('servo-pca9685');

var climate = climateLib.use(tessel.port['A']);
var servo = servoLib.use(tessel.port['B']);
var servo1 = { deviceId: require('os').networkInterfaces().eth0[0].mac, position: 0 };
var servoToggle = null;

climate.on('ready', function () {
  console.log('Connected to climate module');

  // Loop forever
  setInterval(function () {
    climate.readTemperature('f', function (err, temp) {
      climate.readHumidity(function (err, humid) {
        console.log(`Tessel ID ${tessel.deviceId}\tTemp: ${temp.toFixed(4)}F, Humidity: ${humid.toFixed(4)}%RH`);
	request.post({
	  headers: { 'content-type': 'application/json' },
	  url: 'http://192.168.1.170:3000/api/postDeviceData',
	  body: JSON.stringify({ deviceId: 123 }),
	}, (err, res, body) => {
	  try {
	    console.log(res.statusCode);
	  } catch (error) {
	   console.log(error);
	  }
	});
      });
    });
  }, 1000);
});

climate.on('error', function(err) {
  console.log('error connecting module', err);
});

servo.on('ready', function() {
  console.log('Servo ready');
});


// server part
var server = restify.createServer();
server.use(plugins.bodyParser());

server.put('/command', (req, res) => {
  console.log(req.body);
  if (req.body.type === 'servo' && !servo._connected) {
    res.send(500, 'Servo not connected');
  }
  if (req.body.deviceId !== servo1.deviceId) {
    res.send(404, 'DeviceId mismatch');
  }
  if (req.body.type === 'servo' && req.body.value === 'on') {
    servoToggle = setInterval(() => {
      servo.move(servo1.deviceId, servo1.position);
      position += 0.1;
      if (position > 1) {
        position = 0;
      }
    }, 200);
  } else if (req.body.type === 'servo' && req.body.value === 'off' && servoToggle !== null) {
      clearInterval(servoToggle);
  }
});

server.get('/test', (req, res) => {
  console.log(req.body);
});

server.listen(9999, () => {
  console.log('Server running at %s', server.url);
});
