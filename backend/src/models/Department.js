const { Model, DataTypes } = require("sequelize");

class Department extends Model {
	static init(sequelize) {
		super.init({
			name: DataTypes.STRING,
            acronym: DataTypes.STRING,
			boss: DataTypes.STRING,
		}, {
			sequelize,
		});
	}

	static associate(models) {
		this.hasMany(models.Movement, { foreignKey: "origin_department_id", as: "current" });
		this.hasMany(models.Movement, { foreignKey: "destination_department_id", as: "next" });
		this.hasMany(models.Hardware, { foreignKey: "department_id", as: "our_hardwares" });
	}
}

module.exports = Department;