module.exports = class InstanceData {
	/**
	 * Creates an instance of InstanceData.
	 * @param {string} id id of the IndexData based object we will be instantiating
	 * @param {IndexManager} indexManager the index manager that we can use to look up the base index data
	 * @param {InstanceManager} manager the instance manager that
	 */
	constructor(id, indexManager, instanceManager) {
		if (!id || !indexManager || !instanceManager) {
			throw new Error('the "id", "indexManager" and "instanceManager" args are required');
		}

		const indexData = indexManager.get(id);
		if (!indexData) {
			throw Error(`could not find IndexData for ${id}`);
		}

		// These properties are not enumerable so they don't show up in
		// Object.keys or JSON.stringify etc.
		Object.defineProperty(this, '_instanceManager', {
			enumerable: false,
			value: instanceManager
		});

		Object.defineProperty(this, '_indexData', {
			enumerable: false,
			value: indexData
		});
		
		// manage the instance
		// adds to a global linked list
		// as well as instance counts
		instanceManager.add(this);
	}

	// convenience getters
	get indexData() {return this._indexData;}
	get id() {return this._indexData.id;}

	destroy() {
		this._instanceManager.del(this);
	}
};