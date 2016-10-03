var express = require('express');
var router = express.Router();

var UserController = require('./../Controller/UserController');
var TeamsController = require('./../Controller/TeamsController');
var GameController = require('./../Controller/GameController');
var SecurityController = require('./../Controller/SecurityController');

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

router.get('/:id/teams', function(req, res, next){
  var id = req.params.id;
  var limit = req.query.limit;
  var offset = req.query.offset;
  TeamsController.getTeamByUserId(id).then(function(data){
    res.status(200).json({success: false, teams:data});
  }).catch(function(err){
    res.status(200).json({success: false, message:""+ err});
  });
});

router.get('/:id/games', function(req, res, next){
  var id = req.params.id;
  var limit = req.query.limit;
  var offset = req.query.offset;
  GameController.getGameByUserId(id).then(function(data){
    res.status(200).json({success: true, games: data});
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
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;

  if(username && password){
    UserController.createUser(username, password, firstname, lastname, email).then(function(data){
      res.status(200).json({success: true, user: data.rows[0]});
    }).catch(function(err){
      res.status(200).json({success: false, error: err});
    });
  }else{
    res.status(200).json({success: false, error: "Must Enter Username and Password"});
  }
});

router.post('/token', function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;
  if(username && password){
    SecurityController.getToken(username, password).then(function(data){
      res.status(200).json({success: true, token: data});
    }).catch(function(err){
      res.status(200).json({success: false, error: "" + err});
    });
  }else{
    res.status(200).json({success: false, message: "Please Enter a Username and Password"});
  }
});

router.post('/validate', function(req, res, next){
  var token = req.body.token || req.params.token || req.headers['x-access-token'];

  if(token){
    SecurityController.validateToken(token).then(function(data){
      res.status(200).json({success: true, user: data});
    }).catch(function(err){
      res.status(200).json({success: false, error: err});
    })
  }else{
    res.status(200).json({success: false, error: "No token passed"});
  }
});


/**
 * Deleted the user from the database with the given id value
 * @params id - The id of the user
 * @Returning list of users matching that id
 */
router.delete('/:id', function(req, res, next){
  var id = req.params.id;
  UserController.deleteUserById(id).then(function(data){
    res.status(200).json({id: id, user: data});
  }).catch(function(err){
    res.status(200).json({success: false,id: id, message:""+ err});
  });
});

module.exports = router;
