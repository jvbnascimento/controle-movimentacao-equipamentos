const { Model, DataTypes } = require("sequelize");

class Category extends Model {
	static init(sequelize) {
		super.init({
			name: DataTypes.STRING,
		}, {
			sequelize,
		});
	}

	static associate(models) {
		this.hasMany(models.Hardware, { foreignKey: "category_id", as: "hardwares" });
	}
}

module.exports = Category;