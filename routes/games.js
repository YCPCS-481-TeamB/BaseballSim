var express = require('express');
var Promise = require('bluebird').Promise;
var router = express.Router();

var GameController = require("./../Controller/GameController");
var PermissionController = require("./../Controller/PermissionController");
var TeamsController = require("./../Controller/TeamsController");
var LineupController = require("./../Controller/LineupController");

var GameModel = require('./../Models/Game');
var TeamModel = require('./../Models/Team');
var LineupModel = require('./../Models/Lineup');
var ApprovalModel = require('./../Models/Approval');
var PlayerPositionModel = require('./../Models/PlayerPosition');
var GameActionModel = require('./../Models/GameAction');

/**
 * GET for getting all games from database
 * @query limit - limit on the number of record pulled
 * @query offset - offset on pulling items
 */
router.get('/', function(req, res, next) {
    var limit = req.query.limit;
    var offset = req.query.offset;
    GameModel.getAll(limit, offset).then(function(result){
        res.status(200).json({success: true, result: result});
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
    GameController.createGame(team1_id, team2_id, field_id, league_id).then(function(result){
        res.status(200).json({success: true, game: result});
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

    PlayerPositionModel.getByGameActionId(event_id).then(function(data){
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
    GameActionModel.getLatestByGameId(id).then(function(game_action){
        PlayerPositionModel.getByGameActionId(game_action.id).then(function(player_position){
            res.status(200).json({positions: player_position});
        }).catch(function(err){
            res.status(200).json(err);
        });
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
    GameActionModel.getAllByGameId(id).then(function(data){
        res.status(200).json({events: data});
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

    GameActionModel.getLatestByGameId(id).then(function(data){
        res.status(200).json({events: data});
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

    ApprovalModel.getAllByTypeAndItemId('games', id).then(function(data){
        res.status(200).json({approvals: data});
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
    GameController.doGameEvent(id, player1_id, player2_id).then(function(data){
        res.status(200).json(data);
    }).catch(function(err){
        res.status(500).json("" + err);
    });
});

router.get('/:id/events/latest', function(req, res, next){
    var id = req.params.id;

    GameActionModel.getLatestByGameId(id).then(function(data){
        res.status(200).json(data);
    }).catch(function(err){
        res.status(200).json("" + err);
    });
});

router.get("/:id/teams/:team_id/lineup", function(req, res, next){
    var id = req.params.id;
    var team_id = req.params.team_id;

    LineupModel.getByGameAndTeamId(id, team_id).then(function(lineup){
        LineupModel.getLineupPlayersById(lineup.id).then(function(players){
            res.status(200).json(players);
        }).catch(function(err){
           reject(err);
        });
    }).catch(function(err){
        res.status(500).json("" + err);
    });
});

router.get("/:id/users/:user_id/team", function(req, res, next){
    var id = req.params.id;
    var user_id = req.params.user_id;

    TeamModel.getByGameAndUserId(id, user_id).then(function(team){
        TeamModel.getPlayers(team.id).then(function(players){
            res.status(200).json({success: true, players: players});
        }).catch(function(err){
            res.status(500).json({success: false, message: "" + err});
        });
    }).catch(function(err){
        res.status(500).json({success: false, message: "" + err});
    })
});

router.get("/:id/users/:user_id/lineup", function(req, res, next){
    var id = req.params.id;
    var user_id = req.params.user_id;

    LineupModel.getByGameAndUserId(id, user_id).then(function(lineup){
        LineupModel.getLineupPlayersById(lineup.id).then(function(players){
            res.status(200).json(players);
        }).catch(function(err){
            res.status(500).json(err);
        });
    }).catch(function(err){
        res.status(500).json("" + err);
    });
});

//router.post("/:id/autoplay", function(req, res, next){
//    var id = req.params.id;
//    GameController.autoPlay(id).then(function(result){
//        res.status(200).json(result);
//    }).catch(function(err){
//       res.status(500).json(err);
//    });
//});

/**
 * Returns he game from the database with the given id value
 * @params id - The id of the game
 * @Returning list of games matching that id
 */
router.get('/:id', function(req, res, next){
    var id = req.params.id;
    GameModel.getById(id).then(function(data){
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
    GameModel.deleteById(id).then(function(data){
        res.status(200).json({id: id, game: data});
    }).catch(function(err){
        res.status(200).json({success: false,id: id, message:""+ err});
    });
});

router.post('/:id/lineup', function(req, res, next){
    var id = req.params.id;
    var lineup = JSON.parse(req.body.lineup);
    var team_id = req.body.team_id;

    LineupController.createNewLineupByGameAndTeamId(id, team_id, lineup).then(function(result){
        res.status(200).json({lineup: result});
    }).catch(function(err){
        res.status(200).json(err);
    })

});

router.post('/:id/autoplay', function(req, res, next){
    var id = req.params.id;

    GameController.autoPlay(id).then(function(result){
        res.status(200).json(result);
    }).catch(function(err){
        res.status(500).json(err);
    })
});


module.exports = router;
