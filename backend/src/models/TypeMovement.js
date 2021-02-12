const { Model, DataTypes } = require('sequelize');

class TypeMovement extends Model {
	static init(sequelize) {
		super.init({
			description: DataTypes.STRING,
		}, {
			sequelize,
		});
	}

	static associate(models) {
		this.hasMany(models.Movement, { foreignKey: 'type_movement_id', as: 'movement' });
	}
}

module.exports = TypeMovement;