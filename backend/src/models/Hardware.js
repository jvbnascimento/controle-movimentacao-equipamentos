const { Model, DataTypes } = require("sequelize");

class Hardware extends Model {
	static init(sequelize) {
		super.init({
			code: DataTypes.STRING,
			description: DataTypes.STRING(1234),
			brand: DataTypes.STRING,
			warranty: DataTypes.STRING,
			has_office: DataTypes.STRING,
		}, {
			sequelize,
			tableName: "hardwares"
		});
	}

	static associate(models) {
		this.belongsTo(models.Category, { foreignKey: "category_id", as: "category" });
		this.belongsToMany(models.Movement, { foreignKey: "hardware_id", through: "movement_hardwares", as: "movements" });
		this.belongsTo(models.Department, { foreignKey: "department_id", as: "belongs_department" });
		this.belongsTo(models.PublicAgency, { foreignKey: "public_agency_id", as: "belongs_public_agency" });
	}
}

module.exports = Hardware;