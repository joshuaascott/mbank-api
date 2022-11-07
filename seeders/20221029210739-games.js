'use strict';

const { hashPassword } = require('../utils/auth');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('games', [
      {
        alias: 'blue planet',
        isPrivate: true,
        // deepcode ignore NoHardcodedPasswords: <please specify a reason of ignoring this>
        password: await hashPassword('earth12'),
        status: 'STOPPED',
        startBalance: 1500,
        maxPlayers: 3,
      },
      {
        alias: 'smelly cat',
        status: 'STARTED',
        startBalance: 1500,
        maxPlayers: 2,
        startDate: '2022-10-30T00:50',
      },
      {
        alias: 'purple banana',
        status: 'STARTING',
        startBalance: 3000,
        maxPlayers: 3,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('games', null, {});
  },
};
