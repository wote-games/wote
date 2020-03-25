const logger = require('./index');

function diffTime(start) {
	const diff = process.hrtime(start);
	return ((diff[0]*1000)+(diff[1]/1e6)).toFixed(2);
}

module.exports = (req, res, next) => {
	const start = process.hrtime();
	let level = 'info';

	res.on('finish', () => {
		const meta = {
			src: req.ip,
			method: req.method,
			path: req.path,
			code: res.statusCode,
			responseTime: diffTime(start)
		};
		if (res.statusCode >= 200) level = 'info';
		if (res.statusCode >= 300) level = 'debug';
		if (res.statusCode >= 400) level = 'notice';
		if (res.statusCode >= 500) level = 'alert';
		if ([201, 401].includes(res.statusCode)) level = 'warning';
		logger.log(level, res.statusMessage, {http: meta});
	});
	next();
};
