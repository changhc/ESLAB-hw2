// Import the interface to Tessel hardware
var tessel = require('tessel');
var request = require('request');
var restify = require('restify');
var climateLib = require('climate-si7020');
var servoLib = require('servo-pca9685');

var climate = climateLib.use(tessel.port['A']);
var servo = servoLib.use(tessel.port['B']);
var servo1 = { pin: 1, deviceId: require('os').networkInterfaces().eth0[0].mac, position: 0, speed: 0 };
var servoToggle = null;
var sender = null;
var requester = null;

var remoteDomain = 'http://192.168.0.101:3333';
climate.on('ready', function () {
  console.log('Connected to climate module');
  requester = setInterval(() => sendRequest(), 5000);
});

climate.on('error', function(err) {
  console.log('error connecting module', err);
});

servo.on('ready', function() {
  console.log('Servo ready');
});

servo.on('error', function(err) {
  console.error('Servo error', err);
});

const sendRequest = () => {
  request.post({
    headers: { 'content-type': 'application/json' },
    url: remoteDomain + '/api/registerDevice',
    body: JSON.stringify({
      deviceId: servo1.deviceId,
      coordN: 25.0030115,
      coordE: 121.4823595,
    }),
  }, (err, res, body) => {
    try {
      if (res.statusCode > 300) {
        console.log(res.statusCode, body);
        return;
      }
      clearInterval(requester);
      sender = setInterval(function () {
        climate.readTemperature('c', function (err, temp) {
          climate.readHumidity(function (err, humid) {
            console.log(`Tessel ID ${servo1.deviceId}\tTemp: ${temp.toFixed(4)}C, Humidity: ${humid.toFixed(4)}%RH`);
            request.post({
              headers: { 'content-type': 'application/json' },
              url: remoteDomain + '/api/postDeviceData',
              body: JSON.stringify({
                timestamp: Date.now(),
                deviceId: servo1.deviceId,
                temp: temp,
                humidity: humid,
                servoSpeed: servo1.speed,
              }),
            }, (err, res, body) => {
              try {
                if (res.statusCode > 300) {
                  console.log(res.statusCode);
                  clearInterval(sender);
                  stopServo();
                  requester = setInterval(() => sendRequest(), 5000);
                }
              } catch (error) {
                console.log(error);
              }
            });
          });
        });
      }, 5 * 1000);
    } catch (error) {
      console.log(error);
    }
  });
};

const startServo = () => {
  try {
    servo.move(servo1.pin, servo1.position);
    servo1.position += 0.1;
    if (servo1.position > 1) {
      servo1.position = 0;
    }

  } catch (err) {
    console.error(err);
  }
};

const stopServo = () => {
  servo1.speed = 0;
  if (servoToggle !== null) {
    clearInterval(servoToggle);
  }
};
// server part
var server = restify.createServer();
server.use(restify.bodyParser());
server.put('/command', (req, res) => {
  console.log(req.body);
  const body = req.body;
  if (body.type === 'servo' && !servo._connected) {
    res.send(500, 'Servo not connected');
  }
  if (body.deviceId !== servo1.deviceId) {
    res.send(404, 'DeviceId mismatch');
  }
  if (body.type === 'servo' && body.value === 'on') {
    if (servo1.speed === 0) {
      servo1.speed = 0.1;
      servoToggle = setInterval(() => startServo(), 500);
    }
  } else if (body.type === 'servo' && body.value === 'off') {
    stopServo();
  }
  res.send(200);
});

server.get('/test', (req, res) => {
  console.log(req.body);
});

server.listen(9999, () => {
  console.log('Server running at %s', server.url);
});
