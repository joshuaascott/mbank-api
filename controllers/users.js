const express = require('express');
const {
  Player,
  Sequelize: { Op },
} = require('../models');
const {
  validateAlphaNum,
  validateEmail,
  validatePassword,
} = require('../utils/validations');
const { en } = require('../utils/constants');
const { createJWT, comparePasswords, hashPassword } = require('../utils/auth');

/* Create a single player */
exports.register = async (req, res) => {
  // Store required user input
  let { username, email, password } = req.body;

  const errors = [];

  // Validate required user input
  if (typeof username === 'string') username = username.toLowerCase();
  if (typeof email === 'string') email = email.toLowerCase();

  if (!validateAlphaNum(username, 4, 20))
    errors.push(en.ERROR_MSG.USERNAME_FORMAT);
  if (!validateEmail(email)) errors.push(en.ERROR_MSG.EMAIL_FORMAT);
  if (!validatePassword(password, 4, 20))
    errors.push(en.ERROR_MSG.PASSWORD_FORMAT);

  // Return input validation errors
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Query to check database values
  const players = await Player.findAll({
    where: {
      [Op.or]: [{ username: username }, { email: email }],
    },
  })
    .then((players) => players)
    .catch((err) => errors.push(err));

  // Validate user input with database
  let usernameExist = players.filter((p) => p.username == username);
  let emailExist = players.filter((p) => p.email == email);

  if (usernameExist.length > 0)
    errors.push(en.ERROR_MSG.USERNAME_EXIST(username));
  if (emailExist.length > 0) errors.push(en.ERROR_MSG.EMAIL_EXIST(email));

  // Return non-unique value errors
  if (errors.length > 0) {
    return res.status(400).json({ errors });
    // Return the new player object
  } else {
    password = await hashPassword(password);
    const player = await Player.create({ username, email, password });
    await player.reload();

    // Create a token
    const token = createJWT({
      id: player.id,
      username: player.username,
      email: player.email,
    });

    // Validate new token
    if (token === null) errors.push(en.ERROR_MSG.TOKEN_NOT_CREATED);

    // Return the new player object on success
    if (errors.length > 0) {
      return res.status(500).json({ errors });
      // Return database error on failure
    } else {
      return res.status(200).json({ token });
    }
  }
};

/* Login using a given player */
exports.login = async (req, res) => {
  // Store required user input
  let { username, password } = req.body;

  if (typeof username === 'string') username = username.toLowerCase();

  const errors = [];

  // Validate required user input
  let loginType;

  if (typeof username === 'string' && validateAlphaNum(username, 4, 20)) {
    loginType = 'USERNAME';
  } else if (typeof username === 'string' && validateEmail(username)) {
    loginType = 'EMAIL';
  } else {
    loginType = 'INVALID';
    errors.push(en.ERROR_MSG.EMAIL_OR_USER_FORMAT);
  }

  if (typeof username === 'string' && loginType !== 'INVALID') {
    username = username.toLowerCase();
  } else {
    errors.push(en.ERROR_MSG.EMAIL_FORMAT);
  }

  if (!validatePassword(password, 4, 20))
    errors.push(en.ERROR_MSG.PASSWORD_FORMAT);

  let bankLoginAttempt =
    username === en.CONFIG.MBANK_USERNAME || username === en.CONFIG.MBANK_EMAIL;
  if (bankLoginAttempt) errors.push(en.ERROR_MSG.MBANK_NO_LOGIN);

  // Return input validation errors
  if (errors.length > 0) {
    return res.status(bankLoginAttempt ? 403 : 400).json({ errors });
  }

  // Query to check database values
  let player = await Player.findOne({
    where: {
      [Op.or]: [{ username: username }, { email: username }],
    },
  })
    .then((p) => p)
    .catch((err) => errors.push(err));

  // Validate user input with database
  let loginOrPwdIncorrect =
    player == null || !(await comparePasswords(password, player.password));
  let playerLockedOut = player !== null && player.isLocked === true;

  if (loginOrPwdIncorrect) errors.push(en.ERROR_MSG.USER_OR_PWD_INCORRECT);
  if (playerLockedOut) errors.push(en.ERROR_MSG.PLAYER_LOCKED_OUT(username));

  // Create a token
  const token =
    player !== null
      ? createJWT({
          id: player.id,
          username: player.username,
          email: player.email,
        })
      : null;

  // Validate new token
  if (token === null) errors.push(en.ERROR_MSG.TOKEN_NOT_CREATED);

  // Return database validation errors
  if (errors.length > 0) {
    return res.status(401).json({ errors });
    // Return player object on success
  } else {
    return res.status(200).json({ token });
  }
};
