'use strict';

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
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            type_movement_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'type_movements', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
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
                allowNull: true,
                references: { model: 'departments', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            public_agency_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: { model: 'public_agencies', key: 'id' },
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
