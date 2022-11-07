const express = require('express');
const router = express.Router();

/* Get the home route */
router.get('/', function (req, res) {
  return res.status(200).json('Welcome to the mBank API');
});

module.exports = router;
