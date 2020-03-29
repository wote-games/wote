const LinkedList = require('@local/linked-list');
/**
 * A simple class to manage instace references
 */
module.exports = class InstanceManager {
	constructor() {
		this._data = {};
		this._counters = {};
	}

	_checkCreate(id) {
		if (!this._data[id]) {
			this._data[id] = new LinkedList();
			this._counters[id] = {top: 0, deleted: 0};
		}

		return this._data[id];
	}

	_IncrementCounter(id, field) {
		this._counters[id][field] += 1;
		return this._counters[id][field];
	}

	getCounters(id) {return Object.assign({}, this._counters[id] || {top: 0, deleted: 0});}
	/**
	 * get a linked list of active instances
	 *
	 * @param {string} id the indexId of the instance
	 * @returns a linked list of items (may be empty) or null if the id has never been instantiated
	 */
	get(id) {
		return this._data[id] || null;
	}

	/**
	 * some objects like zones, rooms, players - will only have 1 instance
	 *
	 * @param {string} id
	 * @returns {Object} the object at the head of the list which is the most recent
	 */
	resolveOne(id) {
		if (this._data[id]) return this._data[id].head;
	}

	/**
	 * add an instance to be managed in the lis
	 * 
	 * @param {Object} instance an instance of a class with the "id" property
	 */
	add(instance) {
		if (!instance || !instance.id) {
			throw new Error('expected an object with required field "id"');
		}

		const list = this._checkCreate(instance.id);
		
		// a weak way of uniquely identifying an instance
		instance._instanceTag = this._IncrementCounter(instance.id, 'top');
		list.push(instance);
	}

	/**
	 * stop managing a resources
	 *
	 * @param {Object} instance the instance to stop managing
	 * @returns
	 */
	del(instance) {
		if (!instance || !instance.id) return;
		
		const list = this.get(instance.id);
		
		if (list) {
			list.pop(instance);
			this._IncrementCounter(instance.id, 'deleted');
		}
	}
};