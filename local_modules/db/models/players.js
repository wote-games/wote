module.exports = (sequelize, DataTypes) => {
	const Player = sequelize.define('contact', {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		data: {
			type: DataTypes.JSON,
			defaultValue: {}
		}
	}, {
		timestamps: true
	});

	Player.associate = (db) => {
		Player.belongsTo(db.model('account'), {as: 'accountId', foreignKey: 'id'});
	};

	return Player;
};