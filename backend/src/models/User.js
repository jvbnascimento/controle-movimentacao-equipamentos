const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

class User extends Model {
	static init(sequelize) {
		super.init({
			name: DataTypes.STRING,
			email: DataTypes.STRING,
			password: DataTypes.STRING,
		}, {
			sequelize,
			hooks: {
				beforeCreate: (user) => {
					const salt = bcrypt.genSaltSync();
					user.password = bcrypt.hashSync(user.password, salt);
				}
			},
			instanceMethods: {
				validPassword: function (password) {
					return bcrypt.compareSync(password, this.password);
				}
			}
		});
	}

	static associate(models) {
		this.hasMany(models.Movement, { foreignKey: "responsible_id", as: "movements" });
		this.belongsToMany(models.Role, { foreignKey: "user_id", through: "user_roles", as: "roles" });
	}
}

module.exports = User;