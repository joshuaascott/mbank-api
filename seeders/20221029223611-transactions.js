'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('transactions', [
      { playerFrom: 2, playerTo: 1, amount: 40 },
      { playerFrom: 1, playerTo: 4, amount: 100 },
      { playerFrom: 2, playerTo: 4, amount: 110 },
      { playerFrom: 1, playerTo: 2, amount: 30 },
      { playerFrom: 4, playerTo: 2, amount: 200 },
      { playerFrom: 1, playerTo: 4, amount: 100 },
      { playerFrom: 1, playerTo: 2, amount: 90 },
      { playerFrom: 2, playerTo: 4, amount: 140 },
      { playerFrom: 4, playerTo: 1, amount: 110 },
      { playerFrom: 2, playerTo: 4, amount: 180 },
      { playerFrom: 4, playerTo: 2, amount: 10 },
      { playerFrom: 1, playerTo: 4, amount: 150 },
      { playerFrom: 4, playerTo: 1, amount: 160 },
      { playerFrom: 2, playerTo: 4, amount: 190 },
      { playerFrom: 1, playerTo: 2, amount: 40 },
      { playerFrom: 4, playerTo: 2, amount: 80 },
      { playerFrom: 1, playerTo: 4, amount: 30 },
      { playerFrom: 4, playerTo: 1, amount: 60 },
      { playerFrom: 1, playerTo: 2, amount: 10 },
      { playerFrom: 2, playerTo: 4, amount: 130 },
      { playerFrom: 2, playerTo: 1, amount: 50 },
      { playerFrom: 4, playerTo: 2, amount: 110 },
      { playerFrom: 2, playerTo: 4, amount: 10 },
      { playerFrom: 4, playerTo: 2, amount: 30 },
      { playerFrom: 1, playerTo: 2, amount: 170 },
      { playerFrom: 2, playerTo: 4, amount: 90 },
      { playerFrom: 1, playerTo: 2, amount: 130 },
      { playerFrom: 2, playerTo: 4, amount: 10 },
      { playerFrom: 1, playerTo: 4, amount: 110 },
      { playerFrom: 4, playerTo: 1, amount: 10 },
      { playerFrom: 2, playerTo: 4, amount: 50 },
      { playerFrom: 4, playerTo: 2, amount: 160 },
      { playerFrom: 2, playerTo: 4, amount: 60 },
      { playerFrom: 4, playerTo: 2, amount: 80 },
      { playerFrom: 1, playerTo: 4, amount: 180 },
      { playerFrom: 4, playerTo: 1, amount: 70 },
      { playerFrom: 1, playerTo: 4, amount: 150 },
      { playerFrom: 2, playerTo: 1, amount: 110 },
      { playerFrom: 2, playerTo: 1, amount: 70 },
      { playerFrom: 4, playerTo: 2, amount: 110 },
      { playerFrom: 1, playerTo: 2, amount: 70 },
      { playerFrom: 4, playerTo: 2, amount: 200 },
      { playerFrom: 1, playerTo: 2, amount: 10 },
      { playerFrom: 4, playerTo: 1, amount: 20 },
      { playerFrom: 4, playerTo: 2, amount: 140 },
      { playerFrom: 2, playerTo: 1, amount: 180 },
      { playerFrom: 4, playerTo: 2, amount: 190 },
      { playerFrom: 2, playerTo: 4, amount: 140 },
      { playerFrom: 4, playerTo: 1, amount: 150 },
      { playerFrom: 2, playerTo: 1, amount: 30 },
      { playerFrom: 1, playerTo: 4, amount: 30 },
      { playerFrom: 2, playerTo: 1, amount: 170 },
      { playerFrom: 4, playerTo: 1, amount: 200 },
      { playerFrom: 2, playerTo: 4, amount: 130 },
      { playerFrom: 4, playerTo: 1, amount: 180 },
      { playerFrom: 4, playerTo: 2, amount: 30 },
      { playerFrom: 1, playerTo: 4, amount: 120 },
      { playerFrom: 2, playerTo: 1, amount: 120 },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterfact.bulkDelete('transactions', null, {});
  },
};