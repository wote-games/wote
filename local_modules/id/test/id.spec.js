const expect = require('chai').expect;
const id = require('../index');

describe('ID', () => {
	describe('interface uuidv4', () => {
		it('should return a valid UUIDv4', (done) => {
			expect(id.uuidv4()).to.not.be.null;
			expect(id.uuidv4().length).equals(32+4);
			const parts = id.uuidv4().split('-');
			expect(parts.length).equals(5);
			expect(parts[0].length).equals(8);
			expect(parts[1].length).equals(parts[2].length).equals(parts[3].length).equals(4);
			expect(parts[4].length).equals(12);
			done();
		});
	});

	describe('interface uuid', () => {
		it('should return a valid UUID stripped of non hex characters', (done) => {
			expect(id.uuid()).to.not.be.null;
			expect(id.uuid().length).equals(32);
			done();
		});
	});

	describe('interface id', () => {
		it('should return a valid id with (n) bytes of randomness', (done) => {
			const byteSizes = [2, 4, 8, 16, 32];
			for (let bytes of byteSizes) {
				expect(id.id(bytes)).to.not.be.null;
				expect(id.id(bytes).length).equals(bytes*2);	
			}
			done();
		});
	});
});