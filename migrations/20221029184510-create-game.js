'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'games',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        alias: {
          type: Sequelize.STRING(25),
          allowNull: false,
        },
        isPrivate: {
          type: Sequelize.BOOLEAN,
        },
        password: {
          type: Sequelize.STRING(64),
        },
        status: {
          type: Sequelize.ENUM('STARTING', 'STARTED', 'STOPPED'),
          allowNull: false,
          defaultValue: 'STARTING',
        },
        startBalance: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1500,
        },
        maxPlayers: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 2,
        },
        startDate: {
          type: Sequelize.DATE,
        },
        endDate: {
          type: Sequelize.DATE,
        },
      },
      {
        timestamps: false,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('games');
  },
};
