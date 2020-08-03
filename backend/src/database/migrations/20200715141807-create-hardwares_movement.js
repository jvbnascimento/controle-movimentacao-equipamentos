'use strict';

const sequelize = require('sequelize');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('movement_hardwares', {
			hardware_id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				allowNull: false,
				references: { model: 'hardwares', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			movement_id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				allowNull: false,
				references: { model: 'movements', key: 'id' },
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
		await queryInterface.dropTable('movement_hardwares');
	}
};
