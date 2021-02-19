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
				type: Sequelize.STRING,
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
				allowNull: false,
				references: { model: 'departments', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			type_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'types', key: 'id' },
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
