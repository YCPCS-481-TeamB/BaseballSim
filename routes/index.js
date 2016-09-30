var express = require('express');
var router = express.Router();

var AuthenticationMiddleware = require('./../Middleware/AuthenticationMiddleware');


//Sets the default to being logged in for the user... Most pages require login
router.use(function (req, res, next) {
  res.locals.loggedIn = true;
  next()
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET web console page. */
router.get('/console',  function(req, res, next) {
  res.render('webconsole', {title: 'BaseballSim Web Console'});
});

/* GET login page. */
router.get('/login',  function(req, res, next) {
  res.render('login', {title: 'BaseballSim Web Login', loggedIn: false});
});

/* GET teams page. */
router.get('/teams',  function(req, res, next) {
  res.render('teams', {title: 'BaseballSim Teams'});
});

module.exports = router;
