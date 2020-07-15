'use strict';

const sequelize = require('sequelize');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('movements', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			date_movement: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			origin_department_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'departments', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			destination_department_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'departments', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			responsible_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: 'users', key: 'id' },
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
		await queryInterface.dropTable('movements');
	}
};
