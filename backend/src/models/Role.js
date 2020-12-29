const { Model, DataTypes } = require('sequelize');

class Role extends Model {
	static init(sequelize) {
		super.init({
			name: DataTypes.STRING,
		}, {
			sequelize,
			tableName: 'roles',
		});
	}

	static associate(models) {
		this.belongsToMany(models.User, { foreignKey: 'role_id', through: 'user_roles', as: 'users' });
	}
}

module.exports = Role;