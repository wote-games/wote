const expect = require('chai').expect;
const LinkedList = require('../index');

describe('LinkedList', () => {
	describe('Constructor', () => {
		it('should not throw an error when being constructed', (done) => {
			expect(() => new LinkedList()).to.not.throw();
			done();
		});
	});

	describe('Functionality', () => {
		const list = new LinkedList();
		const num=1, str='a', obj={value:num};
		const data = [num, str, obj];

		function compareNum(data){return data==num;}
		function compareStr(data){return data==str;}
		function compareObj(data){return data.value==obj.value;}

		it('should not throw errors when operating on empty list', (done) => {
			expect(() => list.find(num)).to.not.throw();
			expect(() => list.pop(str)).to.not.throw();
			expect(() => list.shift()).to.not.throw();
			expect(() => list.unshift()).to.not.throw();
			done();
		});

		it('should allow inserting arbitrary data types', (done) => {
			for (let item of data) {
				expect(() => list.push(item)).to.not.throw();
			}
			expect(list.length).equals(data.length);
			done();
		});

		it('should not push the same data', (done) => {
			const startLength = list.length;
			for (let item of data) {
				// items still exist
				expect(list.push(item).length).to.equal(startLength);
			}
			done();
		});

		it('should be able to find simple nodes without a callback', (done) => {
			for (let item of data) {
				expect(list.find(item).data).to.equal(item);
			}
			done();
		});

		it('should be able to specify a callback to find nodes', (done) => {
			expect(list.find(num, compareNum).data).to.equal(num);
			expect(list.find(str, compareStr).data).to.equal(str);
			expect(list.find(obj, compareObj).data).to.equal(obj);
			done();
		});

		it('should be able to shift/pop the first node', (done) => {
			// shift
			while(list.head) {
				const head = list.head;
				const next = head.next;
				const length = list.length;
			
				expect(head).to.not.be.null;
				expect(() => list.shift()).to.not.throw();
				expect(list.head).to.deep.equal(next);
				expect(list.length).to.equal(length -1);
			}
			// pop with no callback
			data.forEach((item) => list.push(item));
			data.forEach((item) => list.pop(item));
			// pop with callback
			data.forEach((item) => list.push(item));
			data.forEach((item) => list.pop(item, (value) => {return Object.is(value, item);}));
			done();
		});

		it('should be able to chain push and unshiftNode', (done) => {
			expect(() => {list.push(1).push(2).push(3).push(4);}).to.not.throw();
			expect(list.head.data).equals(4);
			expect(list.push(5).unshift(1).head.data).equals(1);
			done();
		});
	});
});