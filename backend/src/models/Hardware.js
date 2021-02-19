const { Model, DataTypes } = require('sequelize');

class Hardware extends Model {
	static init(sequelize) {
		super.init({
			code: DataTypes.STRING,
			description: DataTypes.STRING,
			brand: DataTypes.STRING,
			warranty: DataTypes.STRING,
			has_office: DataTypes.STRING,
		}, {
			sequelize,
			tableName: 'hardwares'
		});
	}

	static associate(models) {
		this.belongsTo(models.Type, { foreignKey: 'type_id', as: 'category' });
		this.belongsToMany(models.Movement, { foreignKey: 'hardware_id', through: 'movement_hardwares', as: 'movements' });
		this.belongsTo(models.Department, { foreignKey: 'department_id', as: 'belongs' });
	}
}

module.exports = Hardware;