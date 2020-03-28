const bcrypt =require('bcrypt');

module.exports = (sequelize, DataTypes) => {
	const Account = sequelize.define('account', {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {isEmail: true},
			unique: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		data: {
			type: DataTypes.JSON,
			defaultValue: {}
		}
	}, {
		timestamps: true,
		hooks: {
			beforeCreate: (instance) => {
				return new Promise((resolve, reject) => {
					bcrypt.hash(instance.password, 8, (error, encrypted) => {
						if (error) return reject(new Error(error));
						instance.password = encrypted;
						return resolve();
					});
				}); 
			},
			beforeUpdate: (instance) => {
				return new Promise((resolve, reject) => {
					if (instance.changed('password')) {
						bcrypt.hash(instance.password, 8, (error, encrypted) => {
							if (error) return reject(new Error(error));
							instance.password = encrypted;
							return resolve();
						});
					}
					return resolve();
				}); 
			}
		}
	});

	Account.prototype.authenticate = function(password) {
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, this.password, (error, same) => {
				if (error) return reject(new Error(error));
				return resolve(same);
			});
		});
	};

	return Account;
};