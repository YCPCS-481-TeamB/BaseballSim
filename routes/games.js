var express = require('express');
var router = express.Router();

var GameController = require("./../Controller/GameController");

/**
 * GET for getting all games from database
 * @query limit - limit on the number of record pulled
 * @query offset - offset on pulling items
 */
router.get('/', function(req, res, next) {
    var limit = req.query.limit;
    var offset = req.query.offset;
    GameController.getGames(limit, offset).then(function(data){
        res.status(200).json(data);
    }).catch(function(err){
        res.status(200).json({success: false, message:""+ err});
    });
});

/**
 * POST for adding a new game to the database
 * @Body team1_id - id of the first team
 * @Body team2_id - id of the second team
 * @Body field_id - id of the field
 * @Body league_id - id of the league
 * @Returning the json data for the database tables
 */
router.post('/', function(req, res, next){
    var team1_id = req.body.team1_id;
    var team2_id = req.body.team2_id;
    var field_id = req.body.field_id;
    var league_id = req.body.league_id;

    GameController.createGame(team1_id, team2_id, field_id, league_id).then(function(data){
        res.status(200).json(data);
    }).catch(function(err){
        res.status(200).json("" + err);
    });
});

/**
 * Creates the game event for start
 * @params id - The id of the game
 * @Returning game event for start
 */
router.post('/:id/start', function(req, res, next){
    var game_id = req.params.id;
    GameController.startGame(game_id).then(function(data){
        res.status(200).json(data);
    }).catch(function(err){
        res.status(200).json("" + err);
    });
});

/**
 * Gets the game event positions from the given game id and game event id
 * @params id - the game's id
 */
router.get('/events/:event_id/positions', function(req, res, next){
    var event_id = req.params.event_id;

    GameController.getPlayerPositionByGameEventId(event_id).then(function(data){
        res.status(200).json(data);
    }).catch(function(err){
        res.status(200).json(err);
    });
});

/**
 * Gets all game events for a game
 * @params id - the game's id
 */
router.get('/:id/events', function(req, res, next){
    var id = req.params.id;

    GameController.getEventsByGameId(id).then(function(data){
        res.status(200).json(data);
    }).catch(function(err){
        res.status(200).json(err);
    });
});

/**
 * Tells the game to calculate the next event
 * @params id - the game's id
 * @body player1_id the player for team1
 * @body player2_id the player for team2
 */
router.post('/:id/events/next', function(req, res, next){
    var id = req.params.id;
    var player1_id = req.body.player1_id;
    var player2_id = req.body.player2_id;

    if(player1_id && player2_id){
        GameController.doGameEvent(id, player1_id, player2_id).then(function(data){
            res.status(200).json(data);
        }).catch(function(err){
            res.status(200).json(err);
        });
    }else{
        res.status(200).json("Need 2 Players Selected");
    }


});


/**
 * Returns he game from the database with the given id value
 * @params id - The id of the game
 * @Returning list of games matching that id
 */
router.get('/:id', function(req, res, next){
    var id = req.params.id;
    GameController.getGameById(id).then(function(data){
        res.status(200).json({id: id, game: data});
    }).catch(function(err){
        res.status(200).json({success: false,id: id, message:""+ err});
    });
});

/**
 * Deleted the game from the database with the given id value
 * @params id - The id of the game
 * @Returning list of games matching that id
 */
router.delete('/:id', function(req, res, next){
    var id = req.params.id;
    GameController.deleteGamesById(id).then(function(data){
        res.status(200).json({id: id, game: data});
    }).catch(function(err){
        res.status(200).json({success: false,id: id, message:""+ err});
    });
});


module.exports = router;
