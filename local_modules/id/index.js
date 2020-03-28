const randomBytes = require('crypto').randomBytes;
const uuidv4 = require('uuid').v4;

exports.uuidv4 = uuidv4;

exports.uuid = () => {return uuidv4().replace(/[^a-f0-9]*/g, '');};

exports.id = (bytes) => {
	return randomBytes(bytes).toString('hex');
};