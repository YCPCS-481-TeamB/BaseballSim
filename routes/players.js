var express = require('express');
var router = express.Router();

var PlayersController = require('./../Controller/PlayersController');

/**
 * GET for getting all players from database
 * @query limit - limit on the number of record pulled
 * @query offset - offset on pulling items
 */
router.get('/', function(req, res, next) {
    var limit = req.query.limit;
    var offset = req.query.offset;
    PlayersController.getPlayers(limit, offset).then(function(data){
        res.status(200).json(data);
    }).catch(function(err){
        res.status(500).json({success: false, message:""+ err});
    });

});

/**
 * POST for adding a random player to the database
 * @body team_id (Optional) - the id of the team for the player, otherwise
 * @Returning the json data for the database tables
 */
router.post('/', function(req, res, next){
    var team_id = req.body.team_id;
    PlayersController.createRandomPlayer(team_id).then(function(data){
        res.status(200).json(data);
    }).catch(function(err){
       res.status(500).json("" + err);
    });
});


/**
 * Retrieves the player from the database with the given id value
 * @params id - The id of the player
 * @Returning list of players matching that id
 */
router.get('/:id', function(req, res, next){
    var id = req.params.id;
    PlayersController.getPlayersById(id).then(function(data){
        res.status(200).json({id: id, player: data});
    }).catch(function(err){
        res.status(500).json({success: false,id: id, message:""+ err});
    });
});

/**
 * Retrieves the player attributes from the database with the given id value
 * @params id - The id of the player
 * @Returning list of players matching that id
 */
router.get('/:id/attributes', function(req, res, next){
    var id = req.params.id;
    PlayersController.getPlayerAttributesById(id).then(function(data){
        res.status(200).json({id: id, attributes: data});
    }).catch(function(err){
        res.status(500).json({success: false,id: id, message:""+ err});
    });
});

/**
 * Retreives the player stats from the database with the given id value
 * @params id - The id of the player
 * @Returnning list of players matching that id
 */
router.get('/:id/stats', function(req, res, next) {
    var id = req.params.id;
    PlayersController.getStatsByPlayerId(id).then(function(data) {
        res.status(200).json({id: id, stats: data});
    }).catch(function(err){
       res.status(500).json({success: false, id: id, message:""+ err});
    });
});

/**
 * Deleted the player from the database with the given id value
 * @params id - The id of the player
 * @Returning list of players matching that id
 */
router.delete('/:id', function(req, res, next){
    var id = req.params.id;
    PlayersController.deletePlayersById(id).then(function(data){
        res.status(200).json({id: id, player: data});
    }).catch(function(err){
        res.status(500).json({success: false,id: id, message:""+ err});
    });
});

module.exports = router;
