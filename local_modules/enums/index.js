const enumTables = {};

// function to define an enum value as part of an object
// give the property some data validation
const enumValue = (table, obj, prop) => {
	if (!table || !(table instanceof EnumTable)) {
		throw new Error(`No enum table with the name "${table}" could be found`);
	}
	Object.defineProperty(obj, prop, {
		enumerable: true,
		get: function() {return this.value || table.default;},
		set: function(val) {
			if (table.has(val)) {
				this.value = val;
			}
			else {
				throw new Error(`attempt to assign invalid enum value "${val}" from table "${table.name}"`);
			}
		}
	});
};

// structure of an enum type
class EnumTable {
	// get a table from the global list
	static fromGlobal(name) {
		if (!enumTables[name]) {
			throw new Error(`unable to find enum table with name: "${name}"`);
		}

		return enumTables[name];
	}

	static enumValue(tableName, obj, prop) {
		return enumValue(enumTables[tableName], obj, prop);
	}

	constructor(name, values) {
		if (enumTables[name]) {
			throw new Error(`An enum with the name "${name}" already exists`);
		}
		if (!(values instanceof Array)) {
			throw new Error('Enum table values must be an array of strings');
		}
		this._name = name;
		this._values = new Set(values);
		this._arrayValues = Array.from(this._values);
		// add to the list of tables
		enumTables[name] = this;
	}

	get name() {return this._name;}
	get values() {return this._arrayValues;}
	get default() {return this.values[0];}
	get schema() {
		return {
			title: `${this.name} enum values`,
			type: 'string',
			enum: this.values
		};
	}

	has(value) {return this._values.has(value);}
}

module.exports = EnumTable;
