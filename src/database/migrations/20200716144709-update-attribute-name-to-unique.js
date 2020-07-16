'use strict';

const sequelize = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        queryInterface.changeColumn(
            'types',
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
            'types',
            'name',
            {
                type: Sequelize.STRING,
                allowNull: false,
            }
        );
    }
};
