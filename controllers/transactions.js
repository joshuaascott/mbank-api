const express = require('express');
const {
  Game,
  Player,
  Transaction,
  Sequelize: { Op },
} = require('../models');
const { validateNumber } = require('../utils/validations');
const { en } = require('../utils/constants');

/* Get all transactions */
exports.findAll = async (req, res) => {
  // Store optional query filters
  let { playerTo, playerFrom } = req.query;
  let filterParams = {};

  if (validateNumber(playerTo, 1)) filterParams.playerTo = playerTo;
  if (validateNumber(playerFrom, 1)) filterParams.playerFrom = playerFrom;

  const errors = [];

  // Query the database for all transactions
  let transactions = await Transaction.findAll({
    where: {
      ...filterParams,
    },
    raw: true,
  })
    .then((t) => t)
    .catch((err) => errors.push(err));

  // Return database error on failure
  if (errors.length > 0) {
    return res.status(500).json({ errors });
  } else {
    // Return player object on success
    return res.status(200).json({ transactions });
  }
};

/* Get a single transaction */
exports.findOne = async (req, res) => {
  // Get data from request input
  const id = req.params.id;
  const errors = [];

  // Validate required user input
  if (!validateNumber(id, 1)) errors.push(en.ERROR_MSG.ID_IS_NAN);

  // Return input validation errors
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Query the database for transactions with {id}
  const transaction = await Transaction.findOne({
    where: {
      id: id,
    },
  })
    .then((t) => t)
    .catch((err) => errors.push(err));

  // Validate user input with database
  const transactionNotFound = transaction === null;

  if (transactionNotFound) errors.push(en.ERROR_MSG.ID_IS_NAN);

  // Return database error on failure
  if (errors.length > 0) {
    return res.status(transactionNotFound ? 404 : 500).json({ errors });
  } else {
    // Return transaction object on success
    return res.status(200).json({ transaction });
  }
};

/* Create a single transaction */
exports.create = async (req, res) => {
  // Store required user input
  const playerId = req.user.id;
  const { playerFrom, playerTo, amount } = req.body;
  const errors = [];

  // Validate required user input
  if (!validateNumber(playerFrom, 1))
    errors.push(en.ERROR_MSG.SENDER_NOT_FOUND);
  if (!validateNumber(playerTo, 1))
    errors.push(en.ERROR_MSG.RECEIVER_NOT_FOUND);
  if (playerFrom === playerTo) errors.push(en.ERROR_MSG.RECEIVER_SENDER_SAME);
  if (!validateNumber(amount, 1, en.CONFIG.MAX_AMOUNT))
    errors.push(en.ERROR_MSG.AMOUNT_INVALID(en.CONFIG.MAX_AMOUNT));
  if (playerFrom !== 1 && playerFrom !== playerId)
    errors.push(en.ERROR_MSG.TRANS_ONLY_FROM);
  if (playerTo === playerId) errors.push(en.ERROR_MSG.TRANS_ONLY_TO);

  // Return input validation errors
  if (errors.length > 0) return res.status(400).json({ errors });

  // Query to check database values
  const players = await Player.findAll({
    where: {
      id: {
        [Op.or]: [playerFrom, playerTo],
      },
    },
  })
    .then((p) => p)
    .catch((err) => errors.push(err));

  // Validate user input with database
  const sender = await Player.findOne({ where: { id: playerFrom } });
  const receiver = await Player.findOne({ where: { id: playerTo } });
  const playerNotFound = sender === null || receiver === null;

  // Return database validation errors
  if (playerNotFound) {
    errors.push('One or more players not found');
    return res.status(404).json({ errors });
  }

  // Set gameId based on actual values of players
  let gameId = null;
  if (playerFrom !== 1 && sender.gameId !== null) {
    gameId = sender.gameId;
  } else if (receiver.gameId !== null) {
    gameId = receiver.gameId;
  }

  // Return validation errors when player not in the game
  if (gameId === null) {
    errors.push(en.ERROR_MSG.PLAYER_NOT_IN_GAME);
    return res.status(500).json({ errors });
  }

  let transaction;
  let serverError = false;
  let endPlayer = false;
  let endGame = false;
  let availableBalance;
  let messages = [];

  // Update database when the sender and receiver are in the game
  if (players.length === 2) {
    // Query to get a list of all players in the game
    const playersInGame = await Player.findAll({
      where: {
        gameId: gameId,
      },
    })
      .then((p) => p)
      .catch((err) => errors.push(err));

    // Prepare values to update the player and game after the transaction
    endPlayer = playerFrom !== 1 && sender.balance <= amount;
    endGame = endPlayer && playersInGame.length - 1 === 1;

    availableBalance = amount >= sender.balance ? sender.balance : amount;

    // Update the database to change game status of player when the balance is zero
    if (sender.balance < 1) {
      let values = { gameId: null };
      let where = { where: { id: playerFrom } };
      await Player.update(values, where)
        .then((p) => p)
        .catch((err) => errors.push(err));
      errors.push(en.ERROR_MSG.PLAYER_ZERO_BALANCE);
      return res.status(500).json({ errors });
    }

    // Create a new transaction in the database when sender in the game
    if (gameId !== null && sender.balance > 0) {
      transaction = await Transaction.create({
        playerFrom: playerFrom,
        playerTo: playerTo,
        amount: availableBalance,
      })
        .then((t) => t)
        .catch((err) => {
          serverError = true;
          errors.push(err);
        });
      await transaction.reload();
    }

    // Update database to subtract amount from sender's balance
    if (playerFrom !== 1) {
      let values = {
        balance: sender.balance - availableBalance,
        gameId: endPlayer ? null : gameId,
      };
      let where = { where: { id: playerFrom } };
      await Player.update(values, where);
      messages.push(en.MESSAGE.MONEY_SENT(availableBalance, receiver.username));
      if (endPlayer) messages.push(en.MESSAGE.YOU_LOSE);
    } else {
      messages.push(en.MESSAGE.MONEY_SENT(availableBalance, receiver.username));
    }

    // Update the database to end the game when the all players eliminated
    if (endGame) {
      const today = new Date().toISOString();
      let values = { status: 'STOPPED', endDate: today };
      let where = { where: { id: gameId } };
      await Game.update(values, where);
    }

    // Update database and add amount to receiver's balance
    if (playerTo !== 1) {
      let values = { balance: receiver.balance + amount };
      let where = { where: { id: playerTo } };
      await Player.update(values, where);
    }
    // Return validation error when the sender or receiver are invalid
  } else if (players.length === 1) {
    if (receiver.length > 0) errors.push(en.ERROR_MSG.RECEIVER_NOT_FOUND);
    if (sender.length > 0) errors.push(en.ERROR_MSG.SENDER_NOT_FOUND);
    // Return validation error when the sender and receiver are invalid
  } else {
    errors.push(en.ERROR_MSG.RECEIVER_SENDER_SAME);
  }

  // Return database error on failure
  if (errors.length > 0) {
    return res.status(serverError ? 500 : 400).json({ errors });
  } else {
    // Return tranaaction object on success
    return res.status(200).json({ messages, transaction });
  }
};
