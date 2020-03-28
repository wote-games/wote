
const db = require('../index');

const testAccount = {
	username: 'test@example.com',
	password: 'test',
	data: {
		v1: 'something',
		v2: 'else', 
		v3: ['a', 'b', 'c'],
		v4: {
			data: [1, 2, 3],
			other: {example: 'embedded'}
		}
	}
};

db.sync({force: false, alter: {drop: false}})
	.then(() => {
		db.model('account').create(testAccount)
			.then((account) => {
				// console.log(`id: ${account.id} username: ${account.username} password: '${account.password}', data: ${JSON.stringify(account.data, null, 2)}`);
				console.log(JSON.stringify(account.toJSON(), null, 2));
				account.authenticate(testAccount.password)
					.then((same) => {
						console.log(`auth result: ${same}`);
					})
					.catch((error) => {
						throw new Error(error);
					});
			})
			.catch((error) => {
				console.log(error);
			});
	})
	.catch((error) => {
		console.log(error);
	});