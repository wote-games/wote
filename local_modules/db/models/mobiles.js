module.exports = (sequelize, DataTypes) => {
	const Mobile = sequelize.define('mobile', {
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

	Mobile.associate = (db) => {
		Mobile.belongsTo(db.model('zone'), {as: 'zoneId', foreignKey: 'id'});
	};

	return Mobile;
};