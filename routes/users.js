var express = require('express');
var router = express.Router();

var UserController = require('./../Controller/UserController');

/**
 * GET for getting all users from database
 * @query limit - limit on the number of record pulled
 * @query offset - offset on pulling items
 */
router.get('/', function(req, res, next) {
  var limit = req.query.limit;
  var offset = req.query.offset;
  UserController.getUsers(limit, offset).then(function(data){
    res.status(200).json(data);
  }).catch(function(err){
    res.status(200).json({success: false, message:""+ err});
  });
});

/**
 * POST for adding a random player to the database
 * @body team_id (Optional) - the id of the team for the player, otherwise
 * @Returning the json data for the database tables
 */
router.post('/', function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;
  var firstname = req.body.firstname | "";
  var lastname = req.body.lastname | "";
  var email = req.body.email | "";
  if(username && password){
    UserController.createUser(username, password, firstname, lastname, email).then(function(data){
      res.status(200).json(data.rows[0]);
    }).catch(function(err){
      res.status(200).json(err);
    });
  }else{
    res.status(200).json("Must Enter Username and Password");
  }
});

module.exports = router;
