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
  res.render('index', { title: 'Express' , loggedIn: false});
});

router.get('/demo/test', function(req, res, next) {
  res.render('unittest', { title: 'Unit Test Demo'});
});

/* GET web console page. */
router.get('/console',  function(req, res, next) {
  res.render('webconsole', {title: 'BaseballSim Web Console'});
});

/* GET login page. */
router.get('/login',  function(req, res, next) {
  res.render('login', {title: 'BaseballSim Web Login', loggedIn: false});
});

router.get('/chat', function(req, res,next){
  res.render('chat', {title: 'Chat', loggedIn: false});
});

/* GET home page. */
router.get('/docs', function(req, res, next) {
  res.render('api', { title: 'API Docs' });
});


/* GET leagues page */
router.get('/leagues', function(req, res, next){
  res.render('leagues', {title: 'BaseballSim Leagues'})
});

/* GET teams page. */
router.get('/teams',  function(req, res, next) {
  res.render('teams', {title: 'BaseballSim Teams'});
});

/* GET teams page. */
router.get('/games',  function(req, res, next) {
  res.render('games', {title: 'BaseballSim Games'});
});

/* GET teams page. */
router.get('/games/:id',  function(req, res, next) {
  res.render('playgame', {title: 'BaseballSim Game'});
});

/* GET teams page. */
router.get('/games/:id/replay',  function(req, res, next) {
  res.render('replay', {title: 'BaseballSim Game'});
});

/* GET teams page. */
router.get('/games/:id/autoplay',  function(req, res, next) {
  res.render('autoplay', {title: 'BaseballSim Game'});
});

module.exports = router;
