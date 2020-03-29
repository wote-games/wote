const EventEmitter = require('events').EventEmitter;
const logger = require('@local/logger');
const uuid = require('@local/id').uuid;
const LinkedList = require('@local/linked-list');
const IndexManager = require('../index-manager');
const InstanceManager = require('../instance-manager');
const IndexData = require('../index-data');
const InstanceData = require('../instance-data');
const { FlagTable, FlagValue } = require('@local/flags');
const { Zone } = require('../zones/zones');

const lockFlags = new FlagTable('lockFlags', ['easy', 'hard', 'infuriating', 'pickproof']);
const doorFlags = new FlagTable('doorFlags', ['closed', 'locked', 'no-close', 'no-lock', 'no-bash']);

const doorIndexList = {};
const doorList = {};

const doorDataSchema = {
	title: 'Door Index Data',
	type: 'object',
	properties: {
		id: {type: 'string', required: true},
		zoneId: {type: 'string', required: true},
		shortDesc: {type: 'string', required: true},
		keyId: {type: ['null', 'string']},
		doorFlags: doorFlags.schema,
		lockFlags: lockFlags.schema,
	},
	additionalProperties: false
};

const doorIndexManager = new IndexManager();

class DoorData extends IndexData {
	static get manager() {return doorIndexManager;}
	
	constructor(data) {
		super(data, doorDataSchema);

		doorIndexManager.add(this);
	}
}

const doorInstanceManager = new InstanceManager();

class Door extends InstanceData {
	static get manager() {return doorInstanceManager;}

	constructor(id) {
		super(id, doorIndexManager, doorInstanceManager);

		this._doorFlags = new FlagValue('doorFlags', this.indexData.doorFlags);
		this._lockFlags = new FlagValue('lockFlags', this.indexData.lockFlags);
		this._zone = Zone.getManager().resolveOne(this.indexData.zoneId);
		
	}
	// getters
	get zone() {return this._zone;}
	get keyId() {return this.indexData.keyId;}
	get shortDesc() {return this.indexData.shortDesc;}
	// these are a little superfluous but prevents
	// us from accidentally assigning new values
	get doorFlags() {return this._doorFlags;}
	get lockFlags() {return this._lockFlags;}
	// convenience properties
	get isClosed() {
		return this.doorFlags.isSet(['closed']);
	}
	get isLocked() {
		return this.doorFlags.isSet(['locked']);
	}

	// door actions
	// these are to set the door to a specific state
	// don't confuse these with player or npc actions

	open(notify=false) {
		const wasClosed = this.isClosed;
		const wasLocked = this.isLocked;
		this.doorFlags.removeFlags(['closed', 'locked']);
		// emit on state change
		if (wasLocked && notify) this.emit('unlock', this.shortDesc);
		if (wasClosed && notify) this.emit('open', this.shortDesc);
		return this;
	}

	close(notify=false) {
		const wasOpen = !this.isClosed;
		const wasLocked = this.isLocked; 
		this.doorFlags.setFlags(['closed']);
		this.doorFlags.removeFlags(['locked']);
		// emit on state change
		if (wasLocked && notify) this.emit('unlock', this.shortDesc);
		if (wasOpen && notify) this.emit('close', this.shortDesc);
		return this;
	}

	lock(notify=false) {
		const wasUnlocked = !this.isLocked;
		const wasOpen = !this.isClosed;
		this.doorFlags.setFlags(['closed', 'locked']);
		// emit on state change
		if (wasOpen && notify) this.emit('closed', this.shortDesc);
		if (wasUnlocked && notify) this.emit('locked', this.shortDesc);
		return this;
	}

	unlock(notify=false) {
		const wasOpen = !this.isClosed;
		const wasLocked = this.isLocked;
		this.doorFlags.setFlags(['closed']);
		this.doorFlags.removeFlags(['locked']);
		// emit on state change
		if (wasOpen && notify) this.emit('closed', this.shortDesc);
		if (wasLocked && notify) this.emit('unlocked', this.shortDesc);
		return this;
	}

	onTick() {
		this.doorFlags.resetTo(this.indexData.doorFlags);
	}
}

exports.schema = doorDataSchema;
exports.DoorData = DoorData;
exports.Door = Door;