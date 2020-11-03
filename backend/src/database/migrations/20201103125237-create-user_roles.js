'use strict';

const sequelize = require('sequelize');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('user_roles', {
			user_id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				allowNull: false,
				references: { model: 'users', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			role_id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				allowNull: false,
				references: { model: 'roles', key: 'id' },
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
		await queryInterface.dropTable('user_roles');
	}
};
