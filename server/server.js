'use strict'

const restify = require('restify');
const request = require('request');
const path = require('path');
const server = restify.createServer();
let ipList = {};
let database = {};
server.use(restify.bodyParser());
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
server.listen(3333, () => {
  console.log('%s listening to %s', server.name, server.url);
});

server.get('/api/getRealTime', (req, res) => {
  let body = {
    timestamp: Date.now(),
    data: [],
  };
  for (let key in database) {
    if (database.hasOwnProperty(key)) {
      let deviceData = database[key][database[key].length - 1];
      deviceData.deviceId = key;
      deviceData.coordE = ipList[key].coordE;
      deviceData.coordN = ipList[key].coordN;
      body.data.push(deviceData);
    }
  }
  res.send(200, JSON.stringify(body));
});

server.post('/api/getDeviceData', (req, res) => {
  const id = req.body.deviceId;
  try {
    if (!ipList.hasOwnProperty(id)) {
      throw Error('bad request');
    }
  } catch (err) {
    console.error(err);
    res.send(400);
  }

  const body = {
    deviceId: id,
    histData: [],
  };
  const endIndex = database[id].length;
  const dataCount = endIndex < 10 ? endIndex : 10;
  for (let i = dataCount; i > 0; --i) {
    body.histData.push(database[id][endIndex - i]);
  }
  res.send(200, JSON.stringify(body));
});

server.post('/api/registerDevice', (req, res) => {
  const ip = req.connection.remoteAddress.replace('::ffff:', '');
  const deviceId = req.body.deviceId;
  if (!ipList[deviceId] || ipList[deviceId] !== ip) {
    console.log(`new device: ${deviceId}`);
    ipList[deviceId] = { ip: ip, coordN: req.body.coordN, coordE: req.body.coordE };
  }
  res.send(200);
});

server.post('/api/postDeviceData', (req, res) => {
  const deviceId = req.body.deviceId;
  if (!ipList.hasOwnProperty(deviceId)) {
    res.send(403, 'no registration');
  }
  try {
    if (parseInt(deviceId, 10) < 0) {
      throw Error('bad request');
    }
    if (parseFloat(deviceId) !== parseInt(deviceId, 10)) {
      throw Error('bad request');
    }
    if (!database[deviceId]) {
      database[deviceId] = [];
    }
    database[deviceId].push({
      timestamp: req.body.timestamp,
      temp: req.body.temp,
      humidity: req.body.humidity,
      servoSpeed: req.body.servoSpeed,
    });
    res.send(202);
  } catch (err) {
    console.log(err);
    res.send(400);
  }
});

server.put('/api/controlDevice', (req, res) => {
  try{
    const key = req.body.deviceId;
    if (ipList.hasOwnProperty(key)) {
      console.log(ipList[key]);
      request.put({
        headers: { 'content-type': 'application/json' },
        url: `http://${ipList[key].ip}:9999/command`,
        body: JSON.stringify(req.body),
      }, (err, res2, body) => {
        if (err) console.log(err);
      });
    }
    res.send(200);
  } catch (err) { console.log(err); res.send(500, err); }
});

server.get(/\/*/, restify.serveStatic({
  directory: path.join(__dirname, '/src'),
  default: 'index.html',
}));
