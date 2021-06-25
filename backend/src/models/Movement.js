const { Model, DataTypes } = require("sequelize");

class Movement extends Model {
	static init(sequelize) {
		super.init({
			movement_date: DataTypes.DATEONLY,
		}, {
			sequelize,
		});
	}

	static associate(models) {
		this.belongsTo(models.Department, { foreignKey: "origin_department_id", as: "previous_department" });
		this.belongsTo(models.Department, { foreignKey: "destination_department_id", as: "next_department" });
		this.belongsTo(models.PublicAgency, { foreignKey: "public_agency_id", as: "next_agency" });
		this.belongsTo(models.User, { foreignKey: "responsible_id", as: "responsible" });
		this.belongsTo(models.MovementType, { foreignKey: "movement_type_id", as: "type" });
		this.belongsToMany(models.Hardware, { foreignKey: "movement_id", through: "movement_hardwares", as: "hardwares" });
	}
}

module.exports = Movement;