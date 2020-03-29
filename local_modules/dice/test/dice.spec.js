const expect = require('chai').expect;
const dice = require('../index');

const diceTypes = [4, 6, 8, 10, 12, 20];

function parseType(type) {
	it(`should be able to parse d${type} strings`, (done) => {
		expect(() => dice.parse(`1d${type}`)).to.not.throw();
		expect(() => dice.parse(`1d${type}+0`)).to.not.throw();
		expect(() => dice.parse(`1d${type}-0`)).to.not.throw();
		expect(() => dice.parse(`1d${type}+09`)).to.not.throw();
		expect(() => dice.parse(`1d${type}-09`)).to.not.throw();
		expect(() => dice.parse(`1d${type}+090`)).to.not.throw();
		expect(() => dice.parse(`1d${type}-090`)).to.not.throw();
		expect(() => dice.parse(`1d${type}+999`)).to.not.throw();
		expect(() => dice.parse(`1d${type}-999`)).to.not.throw();
		done();
	});
}

describe('Dice', function() {
	describe('Random range', function() {
		it('should be inclusive (100 times)', (done) => {
			const iterations = 100;
			const start = 0;
			const end = 20;

			for (let i = 0; i < iterations; i++) {
				const value = dice.randomIntRange(start, end);
				expect(value).to.be.greaterThan(start-1).and.lessThan(end+1);
			}

			done();
		});
	});

	describe('Parsing strings', function() {
		for (let type of diceTypes) {
			parseType(type);
		}

		it('should throw errors on expected bad formats', (done) => {
			for (let type of diceTypes) {
				expect(() => dice.parse(`ad${type}`)).to.throw(Error);
				expect(() => dice.parse(`1d${type+1}`)).to.throw(Error);
				expect(() => dice.parse('1daf')).to.throw(Error);
				expect(() => dice.parse('1daf+1')).to.throw(Error);
				expect(() => dice.parse(`1d${type}+a`)).to.throw(Error);
				expect(() => dice.parse(`1d${type}-a`)).to.throw(Error);
			}
			done();
		});

		it('should return expected values', (done) => {
			const num = 5, bonus=10;

			for (let type of diceTypes) {
				const d = dice.parse(`${num}d${type}+${bonus}`);
				expect(d).to.have.property('num');
				expect(d.num).to.equal(num);
				expect(d).to.have.property('type');
				expect(d.type).to.equal(type);
				expect(d).to.have.property('bonus');
				expect(d.bonus).to.equal(bonus);
			}
			done();
		});
	});

	describe('Rolling', function() {
		const num = 15;
		const bonus=71;

		it('should roll values in the expected ranges', (done) => {
			for (let type of diceTypes) {
				expect(dice.roll(num, type, bonus)).is.a('number');
				expect(dice.roll(num, type)).is.a('number');
				expect(dice.advantage(num, type, bonus)).is.a('number');
				expect(dice.disadvantage(num, type, bonus)).is.a('number');
				expect(dice.percentage()).is.a('number');
			}
			done();
		});

		it('should be possible to roll a 100 with percentage', (done) => {
			let count = 0;
			for (let i = 0; i < 1000; i++) {
				if (dice.percentage() == 100) {
					count++;
				}
			}
			expect(count).to.be.greaterThan(0);
			done();
		});
	});
});