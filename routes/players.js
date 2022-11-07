const express = require('express');
const router = express.Router();
const players = require('../controllers/players');

/* Get a list of all players */
router.get('/', players.findAll);

/* Get a single player */
router.get('/:id', players.findOne);

module.exports = router;
