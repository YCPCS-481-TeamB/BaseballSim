var express = require('express');
var router = express.Router();

var GameController = require("./../Controller/GameController");
var PermissionController = require("./../Controller/PermissionController");
var TeamsController = require("./../Controller/TeamsController");
var LineupController = require("./../Controller/LineupController");

/**
 * GET for getting all games from database
 * @query limit - limit on the number of record pulled
 * @query offset - offset on pulling items
 */
router.get('/', function(req, res, next) {
    var limit = req.query.limit;
    var offset = req.query.offset;
    GameController.getGames(limit, offset).then(function(data){
        res.status(200).json({success: true, games: data});
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
        res.status(200).json({success: true, game: data});
    }).catch(function(err){
        res.status(200).json({success: false, error: err});
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
        res.status(200).json({positions: data});
    }).catch(function(err){
        res.status(200).json(err);
    });
});

/**
 * Gets the game event positions from the given game id and game event id
 * @params id - the game's id
 */
router.get('/:id/positions/latest', function(req, res, next){
    var id = req.params.id;

    GameController.getLatestEventForGame(id).then(function(result){
        GameController.getPlayerPositionByGameEventId(result.id).then(function(data){
            res.status(200).json({positions: data});
        }).catch(function(err){
            res.status(200).json(err);
        });
    }).catch(function(err){
        res.status(500).json(err);
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
 * Gets all game events for a game
 * @params id - the game's id
 */
router.get('/:id/events/latest', function(req, res, next){
    var id = req.params.id;

    GameController.getLatestEventForGame(id).then(function(data){
        res.status(200).json(data);
    }).catch(function(err){
        res.status(200).json(err);
    });
});

/**
 * Gets all game events for a game
 * @params id - the game's id
 */
router.get('/:id/approvals/state', function(req, res, next){
    var id = req.params.id;
    GameController.getLatestEventApprovalsForGame(id).then(function(data){
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
            res.status(200).json("" + err);
        });
    }else{
        GameController.getGameById(id).then(function(game){
                LineupController.getNextLineupPlayerByGameAndTeamId(game[0].id, game[0].team1_id).then(function(lineup_player1){
                    console.log("Lineup Team 1: ", lineup_player1);
                    LineupController.getNextLineupPlayerByGameAndTeamId(game[0].id, game[0].team2_id).then(function(lineup_player2){
                        console.log("Lineup Team 2: ", lineup_player2);
                        GameController.doGameEvent(id, lineup_player1.id, lineup_player2.id).then(function(data){
                            res.status(200).json(data);
                        }).catch(function(err){
                            res.status(200).json("Game Event Cannot Happen: " + err);
                        });
                    }).catch(function(err){
                        res.status(500).json("Lineup 2 cannot be determined: " + err);
                    });
                }).catch(function(err){
                    res.status(500).json("Lineup 1 Cannot be determined: " + err);
                });
        }).catch(function(err){
            res.status(200).json("Game Not Found: " + err);
        });
    }
});

router.get('/:id/events/latest', function(req, res, next){
    var id = req.params.id;

    GameController.getLatestGameActionByGameId(id).then(function(data){
        res.status(200).json(data);
    }).catch(function(err){
        res.status(200).json("" + err);
    });
});

router.get("/:id/teams/:team_id/lineup", function(req, res, next){
    var id = req.params.id;
    var team_id = req.params.team_id;

    LineupController.getLineupByGameAndTeamId(id, team_id).then(function(data){
        res.status(200).json(data);
    }).catch(function(err){
        res.status(500).json("" + err);
    });
});

router.get("/:id/users/:user_id/lineup", function(req, res, next){
    var id = req.params.id;
    var user_id = req.params.user_id;

    LineupController.getLineupByGameAndTeamId(id, user_id).then(function(data){
        res.status(200).json(data);
    }).catch(function(err){
        res.status(500).json("" + err);
    });
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
