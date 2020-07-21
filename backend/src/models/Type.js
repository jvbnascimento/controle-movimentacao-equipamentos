const { Model, DataTypes } = require('sequelize');
const { belongsToMany, hasMany } = require('./User');

class Type extends Model {
	static init(sequelize) {
		super.init({
			name: DataTypes.STRING,
		}, {
			sequelize,
		});
	}

	static associate(models) {
		this.hasMany(models.Hardware, { foreignKey: 'type_id', as: 'hardwares' });
	}
}

module.exports = Type;