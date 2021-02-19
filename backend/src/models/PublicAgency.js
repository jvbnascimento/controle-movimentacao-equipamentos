const { Model, DataTypes } = require('sequelize');

class PublicAgency extends Model {
	static init(sequelize) {
		super.init({
			name: DataTypes.STRING,
			acronym: DataTypes.STRING,
		}, {
			sequelize,
            tableName: 'public_agencies'
		});
	}

	static associate(models) {
		this.hasMany(models.Movement, { foreignKey: 'public_agency_id', as: 'current_agency' });
	}
}

module.exports = PublicAgency;