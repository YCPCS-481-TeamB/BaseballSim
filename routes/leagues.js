var express = require('express');
var router = express.Router();

var LeaguesController = require('./../Controller/LeaguesController');

/* GET home page. */
router.get('/', function(req, res, next) {
	LeaguesController.getLeagues().then(function(data){
		res.status(200).json({leagues: data});
	}).catch(function(err){
		res.status(200).json({success: false, message:""+ err});
	});
});


/*
 * Retrieves the league from the database with the given id value
 * @params id - the id of the league
 */
router.get('/:id', function(req, res, next){
	var id = req.params.id;
	LeaguesController.getLeagueById(id).then(function(data){
		res.status(200).json({id: id, league:data});	
	}).catch(function(err){
		res.status(200).json({success: false, id: id, message:""+ err});
	});
});
 
 
module.exports = router;
