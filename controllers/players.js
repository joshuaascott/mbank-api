const express = require('express');
const {
  Player,
  Game,
  Sequelize: { Op },
} = require('../models');
const { validateNumber, validateAlpha } = require('../utils/validations');
const { en } = require('../utils/constants');
const { decryptJWT } = require('../utils/auth');

/* Get a list of players */
exports.findAll = async (req, res) => {
  // Store optional query filters
  let { isLocked } = req.query;
  let filterParams = {};

  // Validate with allowed values
  if (typeof isLocked === 'string' && validateAlpha(isLock, 4, 5)) {
    isLocked = isLocked.toLowerCase();
    let isLockedAllowedValues = ['true', 'false'];
    if (isLockedAllowedValues.filter((v) => v === isLocked).length > 0) {
      filterParams.isLocked = isLocked.toLowerCase() === 'true' ? 1 : 0;
    }
  }

  filterParams.id = { [Op.ne]: 1 };

  const errors = [];

  // Query the database for all players
  let players = await Player.findAll({
    where: {
      ...filterParams,
    },
    raw: true,
  })
    .then((p) => p)
    .catch((err) => errors.push(err));

  // Return database error on failure
  if (errors.length > 0) {
    return res.status(500).json({ errors });
    // Return player object on success
  } else {
    players = players.map(({ password, ...rest }) => {
      return rest;
    });

    return res.status(200).json({ players });
  }
};

/* Get a single player */
exports.findOne = async (req, res) => {
  // Get data from request input
  const id = req.params.id;
  const errors = [];

  // Validate required user input
  if (!validateNumber(id, 2)) errors.push(en.ERROR_MSG.ID_IS_NAN);

  // Return input validation errors
  if (errors.length > 0) return res.status(400).json({ errors });

  // Query the database for players with {id}
  const player = await Player.findOne({
    where: {
      id: {
        [Op.and]: {
          [Op.eq]: id,
          [Op.ne]: 1,
        },
      },
    },
  })
    .then((p) => p)
    .catch((err) => errors.push(err));

  // Validate user input with database
  let playerNotFound = player === null;

  if (playerNotFound) errors.push(en.ERROR_MSG.PLAYER_NOT_FOUND);

  // Return database error on failure
  if (errors.length > 0) {
    return res.status(playerNotFound ? 404 : 500).json({ errors });
    // Return player object on success
  } else {
    delete player.dataValues.password;
    return res.status(200).json({ player });
  }
};
