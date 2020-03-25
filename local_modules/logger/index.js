const winston = require('winston');

const logger = winston.createLogger({
	levels: winston.config.syslog.levels,
	level: process.env.LOG_LEVEL || 'debug',
	silent: Boolean(process.env.NODE_ENV == 'testing'),
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json()
	),
	transports: [new winston.transports.Console()]
});

module.exports = logger;