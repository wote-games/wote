const pattern = /^(\d+)d(4|6|8|10|12|20)([+-]\d+)?$/i;

const schema = {
	title: 'dice string',
	type: 'string',
	pattern: /^\d+d(?:4|6|8|10|12|20)(?:[+-]\d+)?$/i
};

// inclusive range RNG
function randomIntRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// parse a dice string
function parse(diceString) {
	const match = pattern.exec(diceString);
	if (!match) {
		throw new Error(`invalid dice string "${diceString}"`);
	}

	return {
		num: parseInt(match[1]),
		type: parseInt(match[2]),
		bonus: match.length > 3 ? parseInt(match[3]) : 0
	};
}

// roll a number of the same type of dice
function roll(num, type, bonus=0) {
	let sum = bonus;
	for (let r = 0; r < num; num++) {
		sum += randomIntRange(1, type);
	}
	return sum;
}

// dice way of rolling a percentage
function percentage() {
	const p = (randomIntRange(0, 9)*10)+randomIntRange(0,9);
	return p == 0 ? 100 : p;
}

// roll twice keeping the higher roll
function advantage(num, type, bonus) {
	return Math.max(roll(num, type, bonus), roll(num, type, bonus));
}

// roll twice keeping the lower roll
function disadvantage(num, type, bonus) {
	return Math.min(roll(num, type, bonus), roll(num, type, bonus));
}

exports.pattern = pattern;
exports.schema = schema;
exports.randomIntRange = randomIntRange;
exports.roll = roll;
exports.percentage = percentage;
exports.advantage = advantage;
exports.disadvantage = disadvantage;