module.exports = (sequelize, DataTypes) => {
	const Room = sequelize.define('room', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		data: {
			type: DataTypes.JSON,
			defaultValue: {}
		}
	}, {
		timestamps: true
	});

	Room.associate = (db) => {
		Room.belongsTo(db.model('zone'), {as: 'zoneId', foreignKey: 'id'});
	};

	return Room;
};