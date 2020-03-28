const EventEmitter = require('events').EventEmitter;
const validate = require('jsonschema').validate;
const { FlagTable, FlagValue } = require('@local/flags');
const { EnumTable } = require('@local/enums');
const { Room } = require('./rooms');
const { Door } = require('./doors');

const directions = ['north', 'east', 'south', 'west', 'up', 'down'];
const exitDirEnums = new EnumTable('dirRooms', directions);
const exitFlags = new FlagTable('exitFlags',['door', 'no-pass', 'one-way']);

const exitDataSchema = {
	title: 'Exit Data',
	type: 'object',
	properties: {
		direction: exitDirEnums.schema,
		toRoom: {type: 'string', required: true},
		description: {type: ['null', 'string'], required: true},
		keywords: {type: ['null','object'], additionalProperties: {type: 'string'}, required: true},
		exitFlags: exitFlags.schema,
		doorId: {type: ['null', 'string'], required: true}
	},
	additionalProperties: false
};

class ExitData {
	static get schema() {return exitDataSchema;}

	constructor(ed={}) {
		this.direction = ed.direction || null;
		this.toRoom = ed.toRoom || null;
		this.description = ed.description || null;
		this.exitFlags = ed.exitFlags || [];
		this.keywords = ed.keywords || {};
		this.doorId = ed.doorId || null;
	}

	update(ed) {
		if (validate(ed, exitDataSchema, {throwError: false})) {
			this.direction = ed.direction;
			this.toRoom = ed.toRoom;
			this.description = ed.description;
			this.exitFlags = ed.exitFlags || [];
			this.keywords = ed.keywords || {};
			this.doorId = ed.doorId || null;
		}
	}

	validate(throwError=false) {
		return validate(this, exitDataSchema, {throwError: throwError});
	}

	serialize() {
		this.validate(true);
		return JSON.stringify(this);
	}
}

class Exit extends EventEmitter {
	constructor(room, exitData) {
		super();
		if (!(room instanceof Room)) {
			throw new Error('expected instance of Room');
		}
		if (!(exitData instanceof ExitData)) {
			throw new Error('expected instance of ExitData');
		}

		this._indexData = exitData;
		this._exitFlags = new FlagValue('exitFlags', exitData.exitFlags);
		this._room = room;		
	}

	get direction() {return this._indexData.direction;}
	get room() {return this._room;}
	get toRoom() {return Room.fromGlobal(this._indexData.toRoom);}
	get description() {return this._indexData.description;}
	get door() {return Door.fromGlobal(this._indexData.doorId);}
}

exports.schema = exitDataSchema;
exports.ExitData = ExitData;
exports.Exit = Exit;