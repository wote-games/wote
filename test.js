const IndexData = require('@local/index-data/index-data');

const mySchema = {
	'title': 'test schema',
	type: 'object',
	properties: {
		a: {type: 'string', required: true},
		b: {type: 'number', required: true},
		c: {type: ['null', 'array'], required: true}
	}
};

function defaultData() {
	return {
		a: 'test',
		b: Math.floor(Math.random() * 100)+1,
		c: []
	};
}

class MyClass extends IndexData {
	static getSchema() {return mySchema;}

	constructor(data) {
		super(MyClass, data || defaultData());
	}
}

const testData = {
	a: 'test',
	b: 3,
	c: null
};

const instance = new MyClass();
console.log('default', instance);
instance.b = 5;
instance.validate();
console.log('changed b: ', instance);
instance.update(testData);
console.log('updated ', instance);
