var express = require('express');
var router = express.Router();

var PlayersController = require('./../Controller/PlayersController');

router.get('/', function(req, res, next) {
    PlayersController.getPlayers().then(function(data){
        res.status(200).json({players: data});
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
    var team_id = req.body.team_id;
    PlayersController.createRandomPlayer(team_id).then(function(data){
        //Returns the first and last name for the created player
        res.status(200).json(data.rows[0]);
    }).catch(function(err){
       res.status(200).json(err);
    });
});


/**
 * Retrieves the player from the database with the given id value
 * @params id - The id of the player
 */
router.get('/:id', function(req, res, next){
    var id = req.params.id;
    PlayersController.getPlayersById(id).then(function(data){
        res.status(200).json({id: id, player: data});
    }).catch(function(err){
        res.status(200).json({success: false,id: id, message:""+ err});
    });
});

module.exports = router;
