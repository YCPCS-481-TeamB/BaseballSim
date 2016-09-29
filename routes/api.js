var express = require('express');
var router = express.Router();
var AuthenticationMiddleware = require('./../Middleware/AuthenticationMiddleware');
var teams = require('./teams');
var leagues = require('./leagues');
var players = require('./players');
var fields = require('./fields');
var users = require('./users');
var games = require('./games');

router.use('/users', users);
router.use(AuthenticationMiddleware.validateTokenMiddleware);
router.use('/players', players);
router.use('/teams', teams);
router.use('/fields', fields);
router.use('/leagues', leagues);
router.use('/games', games);

module.exports = router;
