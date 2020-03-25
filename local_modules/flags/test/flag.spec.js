const expect = require('chai').expect;

const { FlagTable, FlagValue } = require('../index');

describe('Flag', function() {
	const tableName = 'new-table-1';
	const tableValues = ['one', 'two', 'three', 'one', 'two', 'three'];
	
	describe('Tables', function() {
		it('should not throw an when error creating a new table', (done) => {
			expect(() => {new FlagTable(tableName, tableValues);}).to.not.throw();
			done();
		});

		it('should throw an error creating a table with a duplicate name', (done) => {
			expect(() => {new FlagTable(tableName, tableValues);}).to.throw(Error);
			done();
		});

		it('should throw an error creating a table with non-array values', (done) => {
			expect(() => {new FlagTable('invalid-table', 'non-array values');}).to.throw(Error);
			done();
		});

		it('should throw an error fetching a non-existing table', (done) => {
			expect(() => {FlagTable.fromGlobal('invalid-table');}).to.throw(Error);
			done();
		});

		it('should have expected properties', (done) => {
			const table = FlagTable.fromGlobal(tableName);
			expect(table).to.have.property('name');
			expect(table).to.have.property('values');
			expect(table).to.have.property('schema');
			done();
		});

		it('should not contain any duplicates', (done) => {
			const table = FlagTable.fromGlobal(tableName);
			for (let index = 0; index < table.values.length; index++) {
				// lookup should always be the same index
				// this will fail when second instance shows first index
				expect(table.values.indexOf(table.values[index])).to.equal(index);
			}
			done();
		});
	});

	describe('Values', function () {
		const testObj = {};

		it('should not throw an error on creation', (done) => {
			expect(() => {testObj.flags = new FlagValue(tableName, []);}).to.not.throw();
			done();
		});

		it('should not throw an error on creation', (done) => {
			expect(() => {testObj.invalid = new FlagValue('invalid-table', []);}).to.throw(Error);
			done();
		});

		it('should allow value validation', (done) => {
			const table = FlagTable.fromGlobal(tableName);

			// don't throw an error on valid assignment
			expect(() => {testObj.flags.resetTo(['one']);}).to.not.throw();
			expect(() => {testObj.flags.resetTo([]);}).to.not.throw();
			// throw an error on invalid assignment
			expect(() => {testObj.flags.resetTo('invalid flag');}).to.throw(Error);
			expect(() => {testObj.flags.resetTo(['invalid flag']);}).to.throw(Error);
			expect(() => {testObj.flags.resetTo(['one', 'invalid flag']);}).to.throw(Error);

			// ensure we can set/remove/toggle/verify every acceptable value individually
			table.values.forEach((value) => {
				// turn flag on explicitly
				expect(() => {testObj.flags.setFlags([value]);}).to.not.throw();
				expect(() => {testObj.flags.setFlags('not an array');}).to.throw(Error);
				expect(() => {testObj.flags.setFlags([value, 'invalid flag']);}).to.throw(Error);
				expect(testObj.flags.isSet([value])).to.be.true;
				// turn flag off explicitly
				expect(() => {testObj.flags.removeFlags([value]);}).to.not.throw();
				expect(testObj.flags.isSet([value])).to.be.false;
				expect(() => {testObj.flags.removeFlags('not an array');}).to.throw(Error);
				expect(() => {testObj.flags.removeFlags([value, 'invalid flag']);}).to.throw(Error);
				expect(testObj.flags.isSet([value])).to.be.false;
				// toggle flag one way
				expect(() => {testObj.flags.toggleFlag(value);}).to.not.throw();
				expect(() => {testObj.flags.toggleFlag([value]);}).to.throw(Error);
				expect(() => {testObj.flags.toggleFlag('invalid flag');}).to.throw(Error);
				expect(testObj.flags.isSet([value])).to.be.true;
				// toggle flag the other way
				expect(() => {testObj.flags.toggleFlag(value);}).to.not.throw();
				expect(testObj.flags.isSet([value])).to.be.false;
			});

			// set multiple flags at once
			expect(() => {testObj.flags.setFlags(table.values);}).to.not.throw();
			expect(() => {testObj.flags.setFlags(table.values.concat(['invalid flag']));}).to.throw(Error);
			// test multiple flags are set
			expect(testObj.flags.isSet(table.values)).to.be.true;
			// flag value
			expect(testObj.flags.value).to.not.be.null;
			// invalid flags
			expect(() => {testObj.flags.isSet('not an array');}).to.throw(Error);
			expect(() => {testObj.flags.isSet(['invalid flag']);}).to.throw(Error);
			done();
		});
	});
});