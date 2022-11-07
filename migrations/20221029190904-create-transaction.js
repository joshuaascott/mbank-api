'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'transactions',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        playerFrom: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'players',
            key: 'id',
            as: 'playerFrom',
          },
        },
        playerTo: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'players',
            key: 'id',
            as: 'playerTo',
          },
        },
        amount: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        processDate: {
          type: 'TIMESTAMP',
          allowNull: false,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        timestamps: false,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  },
};
