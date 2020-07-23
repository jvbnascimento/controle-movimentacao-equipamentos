const { Model, DataTypes } = require('sequelize');

class Hardware extends Model {
	static init(sequelize) {
		super.init({
			id_hardware: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			description: DataTypes.STRING,
		}, {
			sequelize,
			tableName: 'hardwares'
		});
		Hardware.removeAttribute('id');
	}

	static associate(models) {
		this.belongsTo(models.Type, { foreignKey: 'type_id', as: 'category' });
		this.belongsToMany(models.Movement, { foreignKey: 'hardware_id', through: 'movement_hardwares', as: 'movements' });
	}
}

module.exports = Hardware;