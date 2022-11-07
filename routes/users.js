const express = require('express');
const router = express.Router();
const users = require('../controllers/users');

/* Create a new player (registration) */
router.post('/register', users.register);

/* Login with a given player */
router.post('/login', users.login);

module.exports = router;
