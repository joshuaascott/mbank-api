const express = require('express');
const router = express.Router();
const transactions = require('../controllers/transactions');

/* Get a list of all transactions */
router.get('/', transactions.findAll);

/* Get a single transaction */
router.get('/:id', transactions.findOne);

/* Create a single transaction */
router.post('/', transactions.create);

module.exports = router;
