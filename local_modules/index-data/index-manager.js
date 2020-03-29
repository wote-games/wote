/**
 * A simple class to manage references to a single id
 */
module.exports = class IndexManager {
	constructor() {
		this._data = {};
	}

	get(id) {
		return this._data[id];
	}

	add(instance) {
		if (!instance || !instance.id) {
			throw new Error('expected an object with required field "id"');
		}
		this._data[instance.id] = instance;
	}

	del(id) {
		if (id && this._data[id]) {
			delete this._data[id];
		}
	}
};