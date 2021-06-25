const { Model, DataTypes } = require("sequelize");

class MovementType extends Model {
	static init(sequelize) {
		super.init({
			description: DataTypes.STRING,
		}, {
			sequelize,
		});
	}

	static associate(models) {
		this.hasMany(models.Movement, { foreignKey: "movement_type_id", as: "movement" });
	}
}

module.exports = MovementType;