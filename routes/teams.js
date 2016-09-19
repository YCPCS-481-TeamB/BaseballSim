var express = require('express');
var router = express.Router();

var TeamsController = require('./../Controller/TeamsController');

/* GET home page. */
router.get('/', function(req, res, next) {
	TeamsController.getTeams().then(function(data) {
		res.status(200).json({teams: data});
	}).catch(function(err){
		res.status(200).json({success: false, message:""+ err});
	});
    /* res.status(200).json({success: true, message: "Teams"}); */
});

router.post('/', function(req, res, next){
	var teamname = req.body.teamname | "Test";
	var league_id = req.body.league_id | 0;
	TeamsController.buildRandomTeam(teamname, league_id).then(function(response){
		res.status(200).json(response);
	}).catch(function(err){
		res.status(200).json({success: false, message:""+ err});
	});
});

/*
 * Retrieves the team from the database with the given id value
 * @params id = The id of the team
 */
 
 router.get('/:id', function(req, res, next){
	 var id = req.params.id;
	 TeamsController.getTeamById(id).then(function(data){
		 res.status(200).json({id: id, team: data});
	 }).catch(function(err){
		 res.status(200).json({success: false, id: id, message:""+ err});
	 });
 });

/*
 * Retrieves the team from the database with the given id value
 * @params id = The id of the team
 */

router.get('/:id/players', function(req, res, next){
	var id = req.params.id;
	TeamsController.getPlayersByTeamId(id).then(function(data){
		res.status(200).json({id: id, team: data});
	}).catch(function(err){
		res.status(200).json({success: false, id: id, message:""+ err});
	});
});

module.exports = router;
