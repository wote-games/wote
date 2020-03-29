class ListNode {
	constructor(data) {
		this.next = null;
		this.prev = null;
		this.data = data;
	}

	pop() {
		if (this.prev) {
			this.prev.next = this.next;
		}
		if (this.next) {
			this.next.prev = this.prev;
		}
		this.next = null;
		this.prev = null;
		return this;
	}
}

class LinkedList {
	constructor() {
		this.head = null;
		this._length = 0;
	}

	// wanting to know the length of a list is common
	// this is a way to avoid traversing the list when
	// it hasn't changed.
	get length() {return this._length;}
	
	// update the length if it gets out of skew
	// this shouldn't be needed but is here anyway
	resolveLength() {
		let count = 0;
		for (let node = this.head; node != null; node = node.next) count++;
		this._length = count;
		return count;
	}

	// push plain data onto the linkedList
	push(data) {
		if (!this.find(data)) {
			const node = new ListNode(data);
			node.next = this.head;
			if (this.head) this.head.prev = node;
			this.head = node;
			this._resolveLength();
		}
		return this;
	}

	// pop the first node off the list
	shift() {
		const node = this.head;
		if (node) {
			this.head = node.next;
			node.pop();
			this._resolveLength();
		}
		return node;
	}

	// move a node to the head of the list
	unshift(value, cb=null) {
		const node = this.find(value, cb);
		
		if (!node || node == this.head) return this;
		node.pop();
		node.next = this.head;
		this.head.prev = node;
		this.head = node;
		this._resolveLength();
		return this;
	}

	// find a node
	// optional callback is a comparison function taking the data of the node
	// not the node itself so the node cannot be moved from the comparison function
	find(value, cb) {
		if (!value) {
			// should log this...
			return null;
		}

		for (let node = this.head; node != null; node = node.next) {
			if (!cb) {
				if (Object.is(node.data, value)) return node;
			}
			else {
				if (cb(node.data)) return node;
			}
		}
		return null;
	}

	// search for a node and pop it from the list
	pop(value, cb) {
		const node = this.find(value, cb);
		if (node) {
			if (node == this.head) {
				this.shift();
			}
			else {
				node.pop();
				this._resolveLength();
			}
		}
		return node;
	}
}

exports.ListNode = ListNode;
exports.LinkedList = LinkedList;
module.exports = LinkedList;