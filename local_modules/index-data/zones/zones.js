const validate = require('jsonschema').validate;
const uuid = require('@local/id').uuid;

const zoneIndexList = {};
const zoneList = {};

const zoneDataSchema = {
	title: 'Zone Data for storage',
	type: 'object',
	properties: {
		id: {type: 'string', required: true},
		parent: {type: ['null', 'string'], required: true},
		name: {type: 'string', required: true},
		credits: {type: 'string', required: true},
		levels: {
			type: 'object',
			properties: {
				min: {type: 'number', required: true},
				max: {type: 'number', required: true}
			},
			required: false
		}
	}
};

class ZoneData {
	static get schema() {return zoneDataSchema;}

	static fromGlobal(zoneId) {
		return zoneIndexList[zoneId] || null;
	}

	static addToGlobal(zoneData) {
		if (!(zoneData instanceof ZoneData)) {
			throw new Error('expected instance of ZoneData');
		}

		if (ZoneData.fromGlobal(zoneData.id)) {
			throw new Error(`ZoneData with id: "${zoneData.id}" already exists`);
		}

		zoneIndexList[zoneData.id] = zoneData;
	}

	static deleteZone(zoneId) {
		if (!ZoneData.fromGlobal(zoneId)) {
			throw new Error(`ZoneData with id: "${zoneId}" not found`);
		}

		delete zoneIndexList[zoneId];
	}

	constructor(zd={}) {
		this.id = zd.id || uuid();
		this.parent = zd.parent || null;
		this.name = zd.name || 'new zone';
		this.credits = zd.credits || '<unknown name> someone@example.com',
		this.levels = {
			min: zd.levels ? zd.levels.min : 1,
			max: zd.levels ? zd.levels.max : 100
		};

		ZoneData.addToGlobal(this);
	}

	update(zd) {
		if (validate(zd, zoneDataSchema).valid) {
			this.parent = zd.parent;
			this.name = zd.name;
			this.credits = zd.credits;
			if (zd.levels) {
				this.levels.min = zd.levels.min || 1;
				this.levels.max = zd.levels.max || 100;
			}
		}
	}

	validate(throwError=false) {
		return validate(this, zoneDataSchema, {throwError: throwError});
	}

	serialize() {
		// validate on the way out is the best way to
		// ensure validation on the way in
		// throw an error on validation when serializing
		if (this.validate(true).valid) {
			return JSON.stringify(this);
		}
	}
}

class Zone {
	static fromGlobal(zoneId) {
		return zoneList[zoneId] || null;
	}

	static addToGlobal(zone) {
		if (!(zone instanceof Zone)) {
			throw new Error('expected an instance of a Zone');
		}
		if (Zone.fromGlobal(zone.id)) {
			throw new Error(`a zone with id "${zone.id}" already exists`);
		}
		// add it to the list
		zoneList[zone.id] = zone;
	}

	static topLevelZones() {
		const parents = [];

		for (let parentId of Object.keys(zoneList)) {
			if (zoneList[parentId].parent == null) {
				parents.push(parentId);
			}
		}

		return parents;
	}

	constructor(zoneData) {
		// type checking... ugh...
		if (!(zoneData instanceof ZoneData)) {
			throw new Error('expecting an instance of ZoneData');
		}
		// validate or throw errors!
		zoneData.validate(true);
		// add to global list - throws error on duplicate!
		Zone.addToGlobal(this);

		this._indexData = zoneData;
	}

	get id() {return this._indexData.id;}
	get parent() {return this._indexData.parent;}
	get name() {return this._indexData.name;}
	get credits() {return this._indexData.credits;}
	get minLevel() {return this._indexData.levels.min;}
	get maxLevel() {return this._indexData.levels.max;}

	// kind of expensive - use cautiously
	getChildren() {
		const children = [];

		for (let childId of Object.keys(zoneList)) {
			if (zoneList[childId].parent == this.id) {
				children.push(childId);
			}
		}
		return children;
	}

	// kind of expensive - use cautiously
	getPeers() {
		const peers = [];

		for (let peerId of Object.keys(zoneList)) {
			if (zoneList[peerId].parent == this.parent) {
				peers.push(peerId);
			}
		}
		return peers;
	}
}

exports.schema = zoneDataSchema;
exports.ZoneData = ZoneData;
exports.Zone = Zone;