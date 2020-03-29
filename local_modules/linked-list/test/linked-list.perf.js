const randomBytes = require('crypto').randomBytes;
const LinkedList = require('../index');

function hrDiff(start) {
	const diff = process.hrtime(start);
	return ((diff[0]*1000) + (diff[1]/1e6)).toFixed(2);
}

function genId(byteSize) {
	return randomBytes(byteSize).toString('hex');
}

function genData(num, byteSize) {
	const data = [];
	for (let i=0; i<num; i++) {
		data.push({id: genId(byteSize)});
	}
	return data;
}

function insertionTest(list, data) {
	for (let item of data) list.push(item);
}

function searchTest(list, data) {
	for (let item of data) list.find(item);
}

function runTest(num, byteSize, results) {
	let start;
	const data = genData(num, byteSize);
	const list = new LinkedList();
	// console.log('running insertion test...');
	start = process.hrtime();
	insertionTest(list, data);
	results['insertion'].push(hrDiff(start));
	// console.log('running search test...');
	start = process.hrtime();
	searchTest(list, data);
	results['search'].push(hrDiff(start));
}
function parseResults(results) {
	results.summary = {
		insertion: {
			min: Math.min(...results.insertion),
			max: Math.max(...results.insertion),
			sum: results.insertion.reduce((sum, value) => sum+parseFloat(value), 0).toFixed(2),
			avg: results.insertion.reduce((sum, value) => sum+parseFloat(value), 0).toFixed(2) / results.insertion.length
		},
		search: {
			min: Math.min(...results.search),
			max: Math.max(...results.search),
			sum: results.search.reduce((sum, value) => sum+parseFloat(value), 0).toFixed(2),
			avg: results.search.reduce((sum, value) => sum+parseFloat(value), 0).toFixed(2) / results.search.length
		}
	};
}

function repeatTests(iterations, num, byteSize) {
	const results = {nodes: num, dataSize: byteSize*2, insertion: [], search: []};
	console.log(`[iterations: ${iterations} nodeCount: ${num} nodeSize in bytes: ${byteSize*2}] starting test ... `);
	for (let i=0; i<iterations; i++) runTest(num, byteSize, results);
	parseResults(results);
	console.log(results.summary);
}

repeatTests(10, 100, 1024);
repeatTests(10, 100, 2048);
repeatTests(10, 100, 4096);

// const results = {insertion: [], search: []};
// runTest(1000, 2048, results);
// runTest(1000, 2048, results);
// runTest(1000, 2048, results);
// runTest(1000, 2048, results);
// runTest(1000, 4, results);
// runTest(1000, 8, results);
// runTest(1000, 16, results);
// runTest(1000, 32, results);
// runTest(1000, 64, results);
// runTest(1000, 128, results);
// runTest(1000, 256, results);
// console.log(results);