const logger = require('@local/logger');
const uuid = require('@local/id').uuid;
const LinkedList = require('@local/linked-list');
const IndexManager = require('../index-manager');
const InstanceManager = require('../instance-manager');
const IndexData = require('../index-data');
const InstanceData = require('../instance-data');

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
			required: true
		}
	}
};

function zoneDefaults() {
	return {
		id: uuid(),
		parent: null,
		name: 'new zone',
		credits: '"real name" <author@example.com>',
		levels: {min: 1, max: 100}
	};
}

const zoneIndexManager = new IndexManager();

class ZoneData extends IndexData {
	static getManager() {return zoneIndexManager;}
	constructor(data) {
		super(data || zoneDefaults, zoneDataSchema);
		// this will silently overwrite any existing instance
		zoneIndexManager.add(this);
	}
}

const zoneInstanceManager = new InstanceManager();

class Zone extends InstanceData {
	static getManager() {return zoneInstanceManager;}
	constructor(id) {
		super(id, zoneIndexManager, zoneInstanceManager);		
		// keep track of players in the zone
		this._players = new LinkedList();
	}
	// the following are convenience getters so the values
	// must be explicitly changed via editing the indexData
	get parent() {return this.indexData.parent;}
	get name() {return this.indexData.name;}
	get credits() {return this.indexData.credits;}
	get minLevel() {return this.indexData.levels.min;}
	get maxLevel() {return this.indexData.levels.max;}
	// the list of players in the zone
	get players() {return this._players;}
}

exports.schema = zoneDataSchema;
exports.ZoneData = ZoneData;
exports.Zone = Zone;