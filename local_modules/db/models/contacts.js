module.exports = (sequelize, DataTypes) => {
	const Contact = sequelize.define('contact', {
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

	Contact.associate = (db) => {
		Contact.belongsTo(db.model('account'), {as: 'accountId', foreignKey: 'id'});
	};

	return Contact;
};