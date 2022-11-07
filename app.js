const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { protect } = require('./utils/auth');

const app = express();

app.disable('x-powered-by');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./routes/index'));
app.use('/games', protect, require('./routes/games'));
app.use('/players', protect, require('./routes/players'));
app.use('/transactions', protect, require('./routes/transactions'));
app.use('/users', require('./routes/users'));

module.exports = app;
