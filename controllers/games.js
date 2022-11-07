const express = require('express');
const {
  Player,
  Game,
  Sequelize: { Op },
} = require('../models');
const {
  validateAlpha,
  validateAlphaNum,
  validateNumber,
  validatePassword,
} = require('../utils/validations');
const { en } = require('../utils/constants');
const { comparePasswords, hashPassword } = require('../utils/auth');

/* Get a list of games */
exports.findAll = async (req, res) => {
  // Store optional query filters
  let { status } = req.query;
  let statusFilter = null;

  // Validate with allowed valued
  if (typeof status === 'string' && validateAlpha(status, 7, 8)) {
    status = status.toUpperCase();
    let statusAllowedValues = en.CONFIG.GAME_STATE;
    if (statusAllowedValues.filter((v) => v === status).length > 0) {
      statusFilter = status;
    }
  }

  const errors = [];

  // Query the database for all games
  let gamesAll = await Game.findAll({
    attributes: [
      'id',
      'alias',
      'isPrivate',
      'status',
      'startBalance',
      'maxPlayers',
      'startDate',
      'endDate',
    ],
    include: {
      model: Player,
      as: 'players',
      attributes: ['id'],
    },
  })
    .then((g) => g)
    .catch((err) => errors.push(err));

  // Return database error on failure
  if (errors.length > 0) {
    return res.status(500).json({ errors });
    // Return games object on success
  } else {
    let games =
      statusFilter !== null
        ? gamesAll.filter((g) => g.status === statusFilter)
        : gamesAll;
    return res.status(200).json({ games });
  }
};

/* Get a single game */
exports.findOne = async (req, res) => {
  // Store required user input
  const id = req.params.id;
  const errors = [];

  // Validate required user input
  if (!validateNumber(id, 2)) errors.push(en.ERROR_MSG.ID_IS_NAN);

  // Return input validation errors
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Query the database for players with {id}
  const game = await Game.findOne({
    where: { id: req.params.id },
    attributes: [
      'id',
      'alias',
      'isPrivate',
      'status',
      'startBalance',
      'maxPlayers',
      'startDate',
      'endDate',
    ],
    include: {
      model: Player,
      as: 'players',
      attributes: ['id', 'username', 'email', 'balance', 'isLocked'],
    },
  })
    .then((g) => g)
    .catch((err) => errors.push(err));

  // Validate user input with database
  let gameNotFound = game === null;

  if (gameNotFound) errors.push(en.ERROR_MSG.GAME_NOT_FOUND);

  // Return database error on failure
  if (errors.length > 0) {
    return res.status(gameNotFound ? 404 : 500).json({ errors });
    // Return game object on success
  } else {
    return res.status(200).json({ game });
  }
};

/* Create a new game */
exports.create = async (req, res) => {
  // Store required user input
  const userId = req.user.id;
  const {
    alias,
    isPrivate = null,
    password = null,
    startBalance = 1500,
    maxPlayers = 2,
  } = req.body;
  const errors = [];

  // Validate required user input
  if (!validateNumber(userId, 2)) errors.push(en.ERROR_MSG.PLAYER_GAME_CREATE);
  if (!validateAlphaNum(alias, 4, 25))
    errors.push(en.ERROR_MSG.GAME_ALIAS_FORMAT);
  if (isPrivate && !validateAlphaNum(password, 4, 20))
    errors.push(en.ERROR_MSG.PASSWORD_FORMAT);
  if (!validateNumber(startBalance, 1, 5000))
    errors.push(en.ERROR_MSG.AMOUNT_INVALID(en.CONFIG.MAX_AMOUNT));
  if (!validateNumber(maxPlayers, 2, 10))
    errors.push(en.ERROR_MSG.PLAYER_RANGE);

  // Return input validation errors
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Query to check database values
  const existingGame = await Game.findAll({
    where: {
      [Op.or]: {
        alias: alias,
      },
    },
  })
    .then((p) => p)
    .catch((err) => errors.push(err));

  const player = await Player.findOne({ where: { id: userId } })
    .then((p) => p)
    .catch((err) => errors.push(err));

  // Validate user input with database
  if (existingGame.length > 0) {
    errors.push(en.ERROR_MSG.GAME_EXIST(alias));
    return res.status(400).json({ errors });
  }

  if (player === null) {
    errors.push(en.ERROR_MSG.PLAYER_NOT_FOUND);
    return res.status(404).json({ errors });
  }

  let resultId;

  // Create new games object in the database
  const game = await Game.create({
    alias: alias,
    isPrivate: isPrivate,
    password: await hashPassword(password),
    startBalance: startBalance,
    status: 'STARTING',
    maxPlayers: maxPlayers,
  })
    .then((g) => {
      resultId = g.id;
      return g;
    })
    .catch((err) => errors.push(err));

  // Update the player in the database
  await Player.update(
    {
      gameId: resultId,
    },
    {
      where: {
        id: userId,
      },
    }
  )
    .then((p) => p)
    .catch((err) => errors.push(err));

  // Return database error on failure
  if (errors.length > 0) {
    return res.status(500).json({ errors });
    // Return new game object on success
  } else {
    delete game.dataValues.password;
    return res.status(201).json({ game });
  }
};

/* Join a game */
exports.join = async (req, res) => {
  // Store required user input
  const gameId = req.params.id;
  const playerId = req.user.id;
  const { password } = req.body;
  const errors = [];

  // Validate required user input
  if (!validateNumber(playerId, 2)) errors.push(en.ERROR_MSG.PLAYER_ID_FORMAT);
  if (!validateNumber(gameId, 1)) errors.push(en.ERROR_MSG.GAME_ID_FORMAT);

  // Return input validation errors
  if (errors.length > 0) return res.status(400).json({ errors });

  // Query to check database values
  const player = await Player.findOne({
    attributes: ['id', 'username', 'email', 'isLocked', 'gameId'],
    where: {
      id: {
        [Op.and]: {
          [Op.eq]: playerId,
          [Op.ne]: 1,
        },
      },
    },
  })
    .then((player) => player)
    .catch((err) => errors.push(err));

  // Query to check game values
  const game = await Game.findOne({
    attributes: [
      'id',
      'alias',
      'isPrivate',
      'password',
      'status',
      'startBalance',
      'maxPlayers',
      'startDate',
      'endDate',
    ],
    where: {
      id: gameId,
    },
    include: {
      model: Player,
      as: 'players',
      attributes: ['id', 'username', 'email', 'gameId', 'balance', 'isLocked'],
    },
  })
    .then((game) => game)
    .catch((err) => errors.push(err));

  // Validate user input with database
  if (player === null) errors.push(en.ERROR_MSG.PLAYER_NOT_FOUND);
  if (game === null) errors.push(en.ERROR_MSG.GAME_NOT_FOUND);

  if (errors.length > 0) return res.status(404).json({ errors });

  if (player.isLocked) errors.push(en.ERROR_MSG.PLAYER_LOCKED_OUT(game.username));
  if (game.status !== 'STARTING') errors.push(en.ERROR_MSG.GAME_STATUS(game.alias, game.status));
  if (game.players.length >= game.maxPlayers) errors.push(en.ERROR_MSG.GAME_MAX_PLAYERS);
  if (game.isPrivate && !comparePasswords(password, game.password) errors.push(en.ERROR_MSG.GAME_PWD_INCORRECT);

  // Return database validation errors
  if (errors.length > 0) {
    return res.status(gamePwdIncorrect ? 401 : 500).json({ errors });
    // Update the player with game
  } else {
    await player
      .update(
        {
          gameId: game.id,
          balance: game.startBalance,
        },
        {
          fields: ['gameId', 'balance'],
        }
      )
      .then((p) => p)
      .catch((err) => errors.push(err));
    await game.reload();

    // Return database error on failure
    if (errors.length > 0) {
      return res.status(500).json({ errors });
      // Return the updated game object on success
    } else {
      delete game.dataValues.password;
      return res.status(200).json({ game });
    }
  }
};

/** Starts a game */
exports.start = async (req, res) => {
  // Store required user input
  const gameId = req.params.id;
  const playerId = req.user.id;

  const errors = [];

  // Validate required user input
  if (!validateNumber(playerId, 2)) errors.push(en.ERROR_MSG.PLAYER_ID_FORMAT);
  if (!validateNumber(gameId, 1)) errors.push(en.ERROR_MSG.GAME_ID_FORMAT);

  // Return input validation errors
  if (errors.length > 0) return res.status(400).json({ errors });

  // Query to check database values
  const player = await Player.findOne({
    attributes: ['id', 'username', 'email', 'isLocked', 'gameId'],
    where: {
      id: {
        [Op.and]: {
          [Op.eq]: playerId,
          [Op.ne]: 1,
        },
      },
    },
  })
    .then((player) => player)
    .catch((err) => errors.push(err));

  // Query to check game values
  const game = await Game.findOne({
    where: {
      id: gameId,
    },
    include: {
      model: Player,
      as: 'players',
      attributes: ['id', 'username', 'email', 'gameId', 'balance', 'isLocked'],
    },
  })
    .then((game) => game)
    .catch((err) => errors.push(err));

  // Validate user input with database
  if (player === null) errors.push(en.ERROR_MSG.PLAYER_NOT_FOUND);
  if (game === null) errors.push(en.ERROR_MSG.GAME_NOT_FOUND);

  if (errors.length > 0) return res.status(404).json({ errors });

  if (player.isLocked) errors.push(en.ERROR_MSG.PLAYER_LOCKED_OUT(player.username));
  if (game.status !== 'STARTING') errors.push(en.ERROR_MSG.GAME_STATUS(game.alias, game.status));
  if (gameId !== null && game.players.length < 2) errors.push(en.ERROR_MSG.GAME_MIN_PLAYERS(game.alias));
  if (player.gameId !== game.id) errors.push(en.ERROR_MSG.GAME_PLAYER_START);

  // Return database validation errors
  if (errors.length > 0) {
    return res.status(500).json({ errors });
    // Update game in the database
  } else {
    const today = new Date().toISOString();
    await game
      .update({
        status: 'STARTED',
        startDate: today,
      })
      .then((g) => g)
      .catch((err) => errors.push(err));
    await game.reload();

    // Return database error on failure
    if (errors.length > 0) {
      return res.status(500).json({ errors });
      // Return updated game object on success
    } else {
      delete game.dataValues.password;
      return res.status(200).json({ game });
    }
  }
};
