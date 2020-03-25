const expect = require('chai').expect;

const EnumTable = require('../index');

describe('Enum', function() {
	const tableName = 'new-table-1';
	const tableValues = ['one', 'two', 'three', 'one', 'two', 'three'];
	
	describe('Tables', function() {
		it('should not throw an when error creating a new table', (done) => {
			expect(() => {new EnumTable(tableName, tableValues);}).to.not.throw();
			done();
		});

		it('should throw an error creating a table with a duplicate name', (done) => {
			expect(() => {new EnumTable(tableName, tableValues);}).to.throw(Error);
			done();
		});

		it('should throw an error creating a table without array of values', (done) => {
			expect(() => {new EnumTable('invalid-table', 'not an array');}).to.throw(Error);
			done();
		});

		it('should throw an error looking for a missing table', (done) => {
			expect(() => {EnumTable.fromGlobal('invalid name');}).to.throw(Error);
			done();
		});

		it('should have expected properties', (done) => {
			const table = EnumTable.fromGlobal(tableName);
			expect(table).to.have.property('name');
			expect(table).to.have.property('values');
			expect(table).to.have.property('default');
			expect(table).to.have.property('schema');
			expect(table.name).equals(tableName);
			expect(table.default).equals(tableValues[0]);
			done();
		});

		it('should not contain any duplicates', (done) => {
			const table = EnumTable.fromGlobal(tableName);
			for (let index = 0; index < table.values.length; ++index) {
				// lookup should always be the same index, additional ones will fail after the first
				expect(table.values.indexOf(table.values[index])).to.equal(index);
			}
			done();
		});
	});

	describe('Values', function () {
		const testObj = {};

		it('should allow value validation', (done) => {
			const table = EnumTable.fromGlobal(tableName);
			const enumValue = EnumTable.enumValue;

			// setting up the property
			expect(() => {enumValue(table.name, testObj, 'eVal');}).to.not.throw();
			// invalid table name
			expect(() => {enumValue('invalid table name', testObj, 'eVal');}).to.throw(Error);
			// ensure the value is the expected default since we haven't set it yet
			expect(testObj.eVal).to.equal(table.default);
			// ensure we can set every acceptable value
			tableValues.forEach((value) => {
				expect(() => {testObj.eVal = value;}).to.not.throw();
				expect(testObj.eVal).to.equal(value);
			});
			// validate behaviour when data validation fails
			expect(() => {testObj.eVal = 'invalid value';}).to.throw(Error);
			done();
		});
	});
});