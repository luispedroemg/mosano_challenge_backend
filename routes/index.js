const express = require('express');
const countriesRouter = require('./countries');
const usersRouter = require('./users');

const router = express.Router();
router.use('/users', usersRouter);
router.use('/countries', countriesRouter);

module.exports = router;
