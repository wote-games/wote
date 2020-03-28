const validate = require('jsonschema').validate;
const id = require('@local/id');
const { FlagTable, FlagValue } = require('@local/flags');
const { EnumTable, EnumValue } = require('@local/enums');


const roomIndexList = {};
const roomList = {};

const roomDataSchema = {
	title: 'Room Data for storage',
	type: 'object',
	properties: {
		id: {type: 'string', required: true},
		zoneId: {type: 'string', required: true},
		shortDesc: {type: 'string', required: true},
		description: {type: 'string', required: true},
		exits: {
			type: 'object'
		}
	}
};

class RoomData {
	static get schema() {return roomDataSchema;}

	constructor(zd={}) {
		this.id = zd.id || id.uuid();
		this.parent = zd.parent || null;
		this.name = zd.name || 'new room';
		this.credits = zd.credits || '<unknown name> someone@example.com',
		this.levels = {
			min: zd.levels ? zd.levels.min : 1,
			max: zd.levels ? zd.levels.max : 100
		};
	}

	validate(throwError=false) {
		return validate(this, roomDataSchema, {throwError: throwError});
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

class Room {
	static fromGlobal(roomId) {
		return roomList[roomId] || null;
	}

	static topLevelRooms() {
		const parents = [];

		for (let parentId of Object.keys(roomList)) {
			if (roomList[parentId].parent == null) {
				parents.push(parentId);
			}
		}

		return parents;
	}

	constructor(roomData) {
		// type checking... ugh...
		if (!(roomData instanceof RoomData)) {
			throw new Error('expecting an instance of RoomData');
		}
		// validate or throw errors!
		roomData.validate(true);
		// make sure we are not a duplicate!
		if (roomList[roomData.id]) {
			throw new Error(`A room with the id: "${roomData.id}" already exists`);
		}

		this._indexData = roomData;
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

		for (let childId of Object.keys(roomList)) {
			if (roomList[childId].parent == this.id) {
				children.push(childId);
			}
		}

		return children;
	}
}

exports.schema = roomDataSchema;
exports.RoomData = RoomData;
exports.Room = Room;