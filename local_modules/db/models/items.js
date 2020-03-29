module.exports = (sequelize, DataTypes) => {
	const Item = sequelize.define('item', {
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

	Item.associate = (db) => {
		Item.belongsTo(db.model('zone'), {as: 'zoneId', foreignKey: 'id'});
	};

	return Item;
};