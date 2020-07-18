'use strict';

const sequelize = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        queryInterface.changeColumn(
            'departments',
            'name',
            {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            }
        );
    },

    down: async (queryInterface, Sequelize) => {
        queryInterface.changeColumn(
            'departments',
            'name',
            {
                type: Sequelize.STRING,
                allowNull: false,
            }
        );
    }
};
