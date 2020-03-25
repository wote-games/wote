const expect = require('chai').expect;
const supertest = require('supertest');

describe('Logger', () => {
	const logger = require('../index');
	const levels = ['debug', 'info', 'notice', 'warning', 'error', 'crit', 'alert', 'emerg'];

	describe('Log Levels', () => {
		it('should log with each log level without throwing an exception', (done) => {
			for(let level of levels) {
				expect(() => logger.log(level, 'test')).to.not.throw();
			}
			done();
		});
	});

	describe('Request Logger', () => {
		const codes = [101, 200, 201, 301, 400, 401, 404, 500, 501];
		const app = supertest(require('./stub-server'));
	
		describe('log each request', () => {
			for (let code of codes) {
				testCode(app, code);
			}
		});
	});
});

function testCode(app, code) {
	it(`should log code ${code}`, (done) => {
		app.get(`/${code}`)
			.expect(code)
			.end((error, res) => {
				done(error);
			});
	});
}

