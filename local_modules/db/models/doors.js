module.exports = (sequelize, DataTypes) => {
	const Door = sequelize.define('door', {
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

	Door.associate = (db) => {
		Door.belongsTo(db.model('zone'), {as: 'zoneId', foreignKey: 'id'});
	};

	return Door;
};