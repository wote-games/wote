const fs = require('fs');
const path = require('path');
const sequelize = require('sequelize');

const db = new sequelize.Sequelize({
	dialect: 'sqlite',
	storage: path.join(__dirname, '../../database/wote.sqlite3')
});

// load all the models
const modelsDir = path.join(__dirname, 'models');
fs.readdirSync(modelsDir)
	.filter((filename) => {return path.extname(filename) == '.js' && path.basename(filename, '.js') !== 'index';})
	.forEach((filename) => {
		db.import(path.basename(filename, '.js'), require(path.join(modelsDir, filename)));
	});

// make associations (AKA foreign keys)
for (let modelName of Object.keys(db.models)) {
	if (db.model(modelName).associate){
		db.model(modelName).associate(db);
	}
}

module.exports = db;
