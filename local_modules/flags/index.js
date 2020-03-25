const flagTables = {};

// structure of a flag type
class FlagTable {
	// get a table from the global list
	static fromGlobal(name) {
		if (!flagTables[name]) {
			throw new Error(`unable to find flag table: "${name}"`);
		}
		return flagTables[name];
	}

	constructor(name, values) {
		if (flagTables[name]) {
			throw new Error(`A flag table with the name "${name}" already exists`);
		}
		if (!(values instanceof Array)) {
			throw new Error('Flag table values must be an array of strings');
		}
		this._name = name;
		this._values = new Set(values);
		this._arrayValues = Array.from(this._values);
		// add to the list of tables
		flagTables[name] = this;
	}

	get name() {return this._name;}
	get values() {return this._arrayValues;}
	get schema() {
		return {
			title: `${this.name} flag values`,
			type: 'array',
			items: [{type: 'string', enum: this.values}]
		};
	}

	has(value) {return this._values.has(value);}
}

class FlagValue {
	constructor(tableName, flags) {
		if (!flagTables[tableName]) {
			throw new Error(`unable to find flag table with name "${tableName}"`);
		}
		this._table = flagTables[tableName];
		this._flags = new Set();
		this.resetTo(flags);
	}

	_setFlag(flag) {
		if (this._table.has(flag)) {
			this._flags.add(flag);
		}
		else {
			throw new Error(`unable to find flag "${flag}" in table "${this._table.name}"`);
		}
	}

	_removeFlag(flag) {
		if (this._table.has(flag)) {
			this._flags.delete(flag);
		}
		else {
			throw new Error(`unable to find flag "${flag}" in table "${this._table.name}"`);
		}
	}

	// a comparable string value
	get value() {return Array.from(this._flags).sort().join();}

	// are a set of flags ALL turned on?
	isSet(flags) {
		if (!(flags instanceof Array)) {
			throw new Error('flag values must be an array of one or more strings');
		}

		for (let flag of flags) {
			if (!this._table.has(flag)) {
				throw new Error(`unable to find flag "${flag}" of table "${this._table.name}"`);
			}

			if (!this._flags.has(flag)) return false;
		}

		return true;
	}

	// turn one or more flags on
	setFlags(flags) {
		if (!(flags instanceof Array)) {
			throw new Error('flag values must be an array of one or more strings');
		}
		// add each flag
		flags.forEach((flag) => {
			this._setFlag(flag);
		});
		return this;
	}

	// turn off one or more flags
	removeFlags(flags) {
		if (!(flags instanceof Array)) {
			throw new Error('flag values must be an array of one or more strings');
		}
		// remove each flag
		flags.forEach((flag) => this._removeFlag(flag));
		return this;
	}

	// toggle a single flag on or off
	toggleFlag(flag) {
		if ( typeof flag != 'string' ) {
			throw new Error('toggleFlag takes a single string argument');
		}

		if (this._flags.has(flag)) {
			this._removeFlag(flag);
		}
		else {
			this._setFlag(flag);
		}

		return this;
	}

	// reset flags to a specific state
	resetTo(values) {
		this._flags.clear();
		this.setFlags(values);
		return this;
	}
}

exports.FlagTable = FlagTable;
exports.FlagValue = FlagValue;