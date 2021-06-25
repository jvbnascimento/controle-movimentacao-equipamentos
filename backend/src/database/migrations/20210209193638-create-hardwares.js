'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('hardwares', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			code: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			description: {
				type: Sequelize.STRING(1234),
				allowNull: false,
			},
			brand: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			warranty: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			has_office: {
				type: Sequelize.STRING,
				allowNull: false
			},
			department_id: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: { model: 'departments', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			public_agency_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'public_agencies', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			category_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'categories', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false
			}
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('hardwares');
	}
};
