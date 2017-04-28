const restify = require('restify');
const path = require('path');
const server = restify.createServer();
server.use(restify.bodyParser());
server.listen(3000, () => {
  console.log('%s listening to %s', server.name, server.url);
});

server.get('/api/getRealTime', (req, res) => {
	let body = {
		timestamp: Date.now(),
		data: [],
	};
	for (let i = 0; i < 5; ++i) {
		body.data.push({
			deviceId: i,
			coordN: 25.0314324 + 0.2 * Math.random() - 0.1,
			coordE: 121.5102703 + 0.1 * Math.random() - 0.05,
			temp: 25.3 + 6 * Math.random(),
			humidity: 68 + 10 * Math.random(),
			servoSpeed: 20 + 5 * Math.random(),
		});
	}
	res.send(200, JSON.stringify(body));
});

server.post('/api/getDeviceData', (req, res) => {
	try {
		if (parseInt(req.params.deviceId, 10) < 0) {
			throw Error('bad request');
		}
		if (parseFloat(req.params.deviceId) !== parseInt(req.params.deviceId, 10)) {
			throw Error('bad request');
		}
	} catch (err) {
		console.error(err);
		res.send(400);
	}

	const body = {
		timestamp: Date.now(),
		deviceId: req.params.deviceId,
		temp: 25.3 + 6 * Math.random(),
		humidity: 68 + 10 * Math.random(),
		servoSpeed: 20 + 5 * Math.random(),
		histTemp: [],
		histHumid: [],
		histServo: [],
	};
	for (let i = 0; i < 10; ++i) {
		body.histTemp.push(25.3 + 6 * Math.random());
		body.histHumid.push(68 + 10 * Math.random());
		body.histServo.push(20 + 5 * Math.random());
	}
	res.send(200, JSON.stringify(body));
});

server.post('/api/postDeviceData', (req, res) => {
	try {
		if (parseInt(req.params.deviceId, 10) < 0) {
			throw Error('bad request');
		}
		if (parseFloat(req.params.deviceId) !== parseInt(req.params.deviceId, 10)) {
			throw Error('bad request');
		}
	} catch (err) {
		console.error(err);
		res.send(400);
	}

	res.send(200);
});

server.get(/\/*/, restify.serveStatic({
  directory: path.join(__dirname, '/src'),
  default: 'index.html',
}));
