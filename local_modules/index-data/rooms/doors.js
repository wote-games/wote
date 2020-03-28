const EventEmitter = require('events').EventEmitter;
const validate = require('jsonschema').validate;
const id = require('@local/id');
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

class DoorData extends EventEmitter {
	static get schema() {return doorDataSchema;}
	
	static fromGlobal(doorId) {
		return doorIndexList[doorId] || null;
	}

	static addToGlobal(doorData) {
		if (!(doorData instanceof DoorData)) {
			throw new Error('expected instance of DoorData');
		}

		if (DoorData.fromGlobal(doorData.id)) {
			throw new Error(`DoorData with id: "${doorData.id}" already exists`);
		}

		doorIndexList[doorData.id] = doorData;
	}

	static deleteDoor(doorId) {
		if (!DoorData.fromGlobal(doorId)) {
			throw new Error(`DoorData with id: "${doorId}" not found`);
		}

		delete doorIndexList[doorId];
	}
	
	constructor(doorData={}) {
		super();
		this.id = doorData.id || id.uuid();
		this.zoneId = doorData.zoneId || null;
		this.shortDesc = doorData.shortDesc || 'the door';
		this.keyId = doorData.keyId || null;
		this.doorFlags = doorData.doorFlags || [];
		this.lockFlags = doorData.lockFlags || [];

		Door.addToGlobal(this);
	}

	update(dd) {
		if (validate(dd, doorDataSchema).valid) {
			this.zoneId = dd.zoneId;
			this.shortDesc = dd.shortDesc;
			this.keyId = dd.keyId;
			this.doorFlags = dd.doorFlags;
			this.lockFlags = dd.lockFlags;
			this.emit('updated');
		}
	}

	validate(throwError=false) {
		return validate(this, doorDataSchema, {throwError: throwError});
	}

	serialize() {
		this.validate(true);
		return JSON.stringify(this);
	}
}

class Door extends EventEmitter {

	static fromGlobal(doorId) {
		return doorList[doorId] || null;
	}

	static addToGlobal(door) {
		if (!(door instanceof Door)) {
			throw new Error('expected an instance of a Door');
		}
		if (Door.fromGlobal(door.id)) {
			throw new Error(`a door with id "${door.id}" already exists for zone "${door.zoneId}"`);
		}
		// add it to the list
		doorList[door.id] = door;
	}

	static deleteDoor(doorId) {
		if (Door.fromGlobal(doorId)) {
			delete doorList[doorId];
		}
	}

	constructor(doorData) {
		super();
		if (!(doorData instanceof DoorData)) {
			throw new Error('expected an instance of DoorData');
		}
		// validate - throws error on failure!
		doorData.validate(true);
		// add to the global list - throws error on duplicate!
		Door.addToGlobal(doorData.id);

		this._indexData = doorData;
		this._doorFlags = new FlagValue('doorFlags', doorData.doorFlags);
		this._lockFlags = new FlagValue('lockFlags', doorData.lockFlags);

	}

	// getters
	get id() {return this._indexData.id;}
	get zone() {return Zone.fromGlobal(this._indexData.zoneId);}
	get keyId() {return this._indexData.keyId;}
	get shortDesc() {return this._indexData.shortDesc;}
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
		this.doorFlags.resetTo(this._indexData.doorFlags);
	}
}

exports.schema = doorDataSchema;
exports.DoorData = DoorData;
exports.Door = Door;