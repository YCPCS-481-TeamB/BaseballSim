var express = require('express');
var expressWs = require('express-ws');
var router = express.Router();
var AuthenticationMiddleware = require('./../Middleware/AuthenticationMiddleware');
var teams = require('./teams');
var leagues = require('./leagues');
var players = require('./players');
var fields = require('./fields');
var users = require('./users');
var games = require('./games');
var approvals = require('./approvals');
var websocket = require('./ws');

router.get('/test', function(req, res, next){
    res.status(200).json({success: true, message: 'Yay!'});
});

router.get('/', function(req, res, next){
    res.status(200).render('api', {title: "API Endpoint Listing", loggedIn: false});
});

router.use('/users', users);
router.use('/ws', websocket);
router.use(AuthenticationMiddleware.validateTokenMiddleware);
router.use('/approvals', approvals);
router.use('/players', players);
router.use('/teams', teams);
router.use('/fields', fields);
router.use('/leagues', leagues);
router.use('/games', games);

module.exports = router;
