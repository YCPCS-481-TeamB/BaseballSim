var express = require('express');
var router = express.Router();

var LeaguesController = require('./../Controller/LeaguesController');

/**
 * GET for getting all leagues from database
 * @query limit - limit on the number of record pulled
 * @query offset - offset on pulling items
 */
router.get('/', function(req, res, next) {
	var limit = req.query.limit;
	var offset = req.query.offset;
	LeaguesController.getLeagues().then(function(data){
		res.status(200).json({leagues: data});
	}).catch(function(err){
		res.status(200).json({success: false, message:""+ err});
	});
});


/**
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
