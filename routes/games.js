const express = require('express');
const router = express.Router();
const games = require('../controllers/games');

/* Get the list of games  */
router.get('/', games.findAll);

/* Get a single game */
router.get('/:id', games.findOne);

/* Create a new game */
router.post('/', games.create);

/* Join a game */
router.patch('/:id/join', games.join);

/* Start a game */
router.patch('/:id/start', games.start);

module.exports = router;
