const app = require('express')();
const logger = require('../index');
const requestLogger = require('../requests');

app.use(requestLogger);

app.use('/:code', (req, res) => {
	res.status(parseInt(req.params.code)).send('test message');
});

module.exports = app;