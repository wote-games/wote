const validate = require('jsonschema').validate;
const logger = require('@local/logger');

module.exports = class IndexData {
	/**
	 * Creates an instance of IndexData
	 * @param {Object} data this should neve
	 * @param {Object} [schema={}] jsonschema to validate the data against
	 */
	constructor(data, schema={}) {
		if (!data) {
			throw new Error('the "data" param of IndexData is required and not optional');
		}
		// These properties are not enumerable so they don't show up in
		// Object.keys or JSON.stringify etc.
		Object.defineProperty(this, '_indexDataSchema', {
			enumerable: false,
			value: schema || {}
		});
		// validate the data
		this.update(data);
		logger.debug(`NEW ${this._indexDataDerrivedName} created`);
	}

	/**
	 * Validate the instance data meets the schema
	 * - garbage in / garbage out rule!
	 * call this on an instance before serializing
	 * note this is only helpful AFTER changes have been made
	 * it does nothing to PREVENT bad changes from being made
	 *	 */
	validate() {
		const vResult = validate(this, this._indexDataSchema);
		if (!vResult.valid){
			// log for the derrived class name
			logger.error(`${this._indexDataDerrivedName} validation error`, {error: vResult.errors});
			throw new Error(vResult.errors);
		}
	}

	// unlike validate, update will attempt to validate before making changes
	update(data) {
		// validate BEFORE we make the changes
		const vResult = validate(data, this._indexDataSchema);
		if (vResult.valid) {
			// the cloning here may not be necessary and
			// frankly is fairly inefficient
			const clone = JSON.parse(JSON.stringify(data));
			Object.assign(this, clone);
		}
		else {
			logger.error(`${this._indexDataDerrivedName} validation error on update`, {error: vResult.errors});
			throw new Error(vResult.errors);
		}
	}
};