module.exports = (sequelize, DataTypes) => {
	const Zone = sequelize.define('zone', {
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

	Zone.associate = () => {
		Zone.belongsTo(Zone, {as: 'parentId', foreignKey: 'id'});
	};

	return Zone;
};