var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET web console page. */
router.get('/console', function(req, res, next) {
  res.render('webconsole', {title: 'BaseballSim Web Console'});
});

module.exports = router;
