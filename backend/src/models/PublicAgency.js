const { Model, DataTypes } = require("sequelize");

class PublicAgency extends Model {
	static init(sequelize) {
		super.init({
			name: DataTypes.STRING,
			acronym: DataTypes.STRING,
		}, {
			sequelize,
            tableName: "public_agencies"
		});
	}

	static associate(models) {
		this.hasMany(models.Movement, { foreignKey: "public_agency_id", as: "current_agency" });
		this.hasMany(models.Hardware, { foreignKey: "public_agency_id", as: "our_hardwares" });
	}
}

module.exports = PublicAgency;