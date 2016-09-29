var express = require('express');
var router = express.Router();

var AuthenticationMiddleware = require('./../Middleware/AuthenticationMiddleware');

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
  res.render('login', {title: 'BaseballSim Web Login'});
});

module.exports = router;
