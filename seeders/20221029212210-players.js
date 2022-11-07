'use strict';

const { hashPassword } = require('../utils/auth');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('players', [
      {
        username: 'mbank',
        email: 'mbank@mbank.joshux.website',
        password: await hashPassword('password'),
        balance: 10000000,
      },
      {
        username: 'noobagain',
        email: 'restart@gmail.com',
        password: await hashPassword('password'),
        balance: 4580,
        gameId: 2,
      },
      {
        username: 'idk2',
        email: 'idk2@gmail.com',
        password: await hashPassword('password'),
        balance: 0,
      },
      {
        username: 'finder123',
        email: 'lewis@explorer.com',
        password: await hashPassword('password'),
        balance: 180,
        gameId: 2,
      },
      {
        username: 'bookworm',
        email: 'learner@for.life',
        password: await hashPassword('password'),
        balance: 3000,
        gameId: 3,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('players', null, {});
  },
};
