const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const {
  validateNumber,
  validateAlphaNum,
  validateEmail,
} = require('../utils/validations');

dotenv.config();

exports.comparePasswords = (password, hash) => {
  return bcrypt.compare(password, hash);
};

exports.hashPassword = (password) => {
  return bcrypt.hash(password, 5);
};

exports.createJWT = (user) => {
  if (
    validateNumber(user.id, 2) &&
    validateAlphaNum(user.username, 4, 20) &&
    validateEmail(user.email)
  ) {
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    );
    return token;
  } else {
    return null;
  }
};

exports.protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({ errors: ['Not authorized'] });
    return;
  }

  const [, token] = bearer.split(' ');

  if (!token) {
    res.status(401);
    res.json({ errors: ['Not authorized'] });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (e) {
    res.status(401);
    res.json({ errors: ['Not authorized'] });
    return;
  }
};
