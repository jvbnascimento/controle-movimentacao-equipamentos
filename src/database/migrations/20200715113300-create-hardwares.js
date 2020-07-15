'use strict';

const sequelize = require('sequelize');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('hardwares', {
			id_hardware: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			description: {
				type: Sequelize.STRING,
				allowNull: false,
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
