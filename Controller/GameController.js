var bluebird = require('bluebird');
var Promise = bluebird.Promise;
//var DatabaseController = require('./DatabaseController');
var GameModel = require('./../Models/Game');
var LineupModel = require('./../Models/Lineup');
var GameActionModel = require('./../Models/GameAction');
var PlayerPositionModel = require('./../Models/PlayerPosition');
var ApprovalModel = require('./../Models/Approval');

var PlayerModel = require('./../Models/Player');
var PermissionModel = require('./../Models/Permission');
var PlayerController = require('./PlayersController');
var ApprovalsController = require('./ApprovalsController');
var TeamsController = require('./TeamsController');
var LineupController = require('./LineupController');

exports.createGame = function(team1_id, team2_id, field_id, league_id){
    return new Promise(function(resolve, reject){
        if(team1_id && team2_id){
            GameModel.create(team1_id,team2_id, field_id, league_id).then(function(game){
                //console.log(game);
                Promise.all([PermissionModel.getOwnerForItem('teams', team1_id), PermissionModel.getOwnerForItem('teams', team2_id)]).spread(function(user1_id, user2_id){
                    console.log(user1_id, user2_id);
                    Promise.all([ApprovalModel.create('games', game.id, user2_id), PermissionModel.create(user1_id,game.id,'games'), PermissionModel.create(user2_id,game.id,'games')]).then(function(result){
                        resolve(game);
                    }).catch(function(err){
                        reject(err);
                    });
                }).catch(function(err){
                    reject(err);
                });
            }).catch(function(err){
                reject(err);
            });
        }else {
            reject("Must have 2 teams in a game!");
        }
    });
}

function isGameStarted(game_id){
    return new Promise(function(resolve, reject){
        GameModel.hasEventWithType(game_id, 'start').then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

function foo(game_id) {
    function doo() {
        // always return a promise
        GameModel.hasEventWithType(game_id, 'end').then(function(isEnded) {
            if (!isEnded) {
                return exports.doGameEvent(game_id).then(doo);
            } else {
                return Promise.resolve();
            }
        }).catch(function(err){
           reject(err);
        });
    }
    return doo(); // returns a promise
}

exports.autoPlay = function(game_id){
    return new Promise(function(resolve, reject){
        GameModel.getById(game_id).then(function(game){
            GameModel.hasEventWithType(game_id, 'start').then(function(isStarted){
                console.log("IS GAME STARTED: ", isStarted);
                exports.startGame(game_id).then(function(start_event){
                    foo(game_id).then(function(result){
                        GameActionModel.getAllByGameId(game_id).then(function(game_actions){
                            resolve(result);
                        }).catch(function(err){
                            reject(err);
                        });
                    }).catch(function(err){
                        reject(err);
                    });
                }).catch(function(err){
                   reject(err);
                });
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

function createInitialGamePlayerPositions(game_action_id){
    return new Promise(function(resolve, reject){
        PlayerPositionModel.create(game_action_id).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

function toggleTeamAtBat(game, game_action){
    return new Promise(function(resolve, reject){
        var newTeamAtBat = 0;

        if(game.team1_id === game_action.team_at_bat){
            newTeamAtBat = game.team2_id;
        }else{
            newTeamAtBat = game.team1_id;
        }

        Promise.each([GameActionModel.update(game_action.id, {team_at_bat: newTeamAtBat}),PlayerPositionModel.clearBasesByGameActionId(game_action.id)], function(){}).spread(function(game_action_result, clear_bases_position){
            resolve(game_action_result);
        }).catch(function(err){
            reject(err);
        });
    });
}

function updateGameScore(game_action_id, score){
    return new Promise(function(resolve, reject){
        GameActionModel.getById(game_action_id).then(function(game_action){
            GameModel.getById(game_action.game_id).then(function(game){
                if(game.team1_id == game_action.team_at_bat){
                    GameActionModel.update(game_action_id, {team1_score : score}).then(function(updatedGameAction){
                        resolve(updatedGameAction);
                    }).catch(function(err){
                       reject(err);
                    });
                }else{
                    GameActionModel.update(game_action_id, {team2_score : score}).then(function(updatedGameAction){
                        resolve(updatedGameAction);
                    }).catch(function(err){
                        reject(err);
                    });
                }
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.calculatePlayerPositionByEventResult = function(game, game_action, player_position, player, game_result){

    var returnObject = {
        newPosition: player_position,
        change_out_player : false,
        update_game_score : false,
        newScore : 0
    };

    //Setup
    var player_pos_arr = [player_position.onfirst_id, player_position.onsecond_id, player_position.onthird_id];
    var movements = 0;

    if(game_action.team_at_bat == game.team1_id){
        var score = game_action.team1_score;
    }else if(game_action.team_at_bat == game.team2_id){
        var score = game_action.team2_score;
    }else{
        var score = 0;
    }

    var changeoutplayer = false;

    if(game_result == 'walk' || game_result == 'single'){
        movements = 1;
    }else if(game_result == 'double'){
        movements = 2;
    }else if(game_result == 'triple'){
        movements = 3;
    }else if(game_result == 'home_run'){
        movements = 4;
    }

    //Calculate The New Player Position
    if(movements > 0){
        changeoutplayer = true;
        for(var i = player_pos_arr.length;i>0;i--){
            var index = i-1;
            if(player_pos_arr[index] != 0){
                if((i + movements) > 3){
                    score++;
                    player_pos_arr[index] = 0;
                }else{
                    player_pos_arr[index + movements] = player_pos_arr[index];
                    player_pos_arr[index] = 0;
                }
            }
        }
        if(movements > 3){
            score++;
        }else{
            player_pos_arr[movements-1] = player.id;
        }
    }

    //Update Return Object
    returnObject.newPosition.onfirst_id = player_pos_arr[0];
    returnObject.newPosition.onsecond_id = player_pos_arr[1];
    returnObject.newPosition.onthird_id = player_pos_arr[2];

    returnObject.update_game_score = (returnObject.newScore != score);

    returnObject.newScore = score;

    returnObject.change_out_player = changeoutplayer;

    return returnObject;

}

function updatePlayerPositionByEventResult(game, game_action, player_position, player, game_result){
    return new Promise(function(resolve, reject){

        var player_pos_cals = exports.calculatePlayerPositionByEventResult(game, game_action, player_position, player, game_result);

        PlayerPositionModel.update(player_position.id, {onfirst_id: player_pos_cals.newPosition.onfirst_id, onsecond_id: player_pos_cals.newPosition.onsecond_id, onthird_id: player_pos_cals.newPosition.onthird_id}).then(function(updated_player_position){
            updateGameScore(game_action.id, player_pos_cals.newScore).then(function(data) {
                if (player_pos_cals.change_out_player === true) {
                    updateGameLineupByResult(game.id).then(function(lineup_data){
                        resolve(updated_player_position);
                    }).catch(function(err){
                        reject(err);
                    });
                } else {
                    resolve(updated_player_position);
                }
            }).catch(function(err){
                reject(err);
            });

        }).catch(function(err){
            reject(err);
        });
    });
}

exports.calculateCountsByEventResult = function(game, game_action, game_result){
    var returnObj = {
        counts: {
            balls: game_action.balls,
            strikes: game_action.strikes,
            outs: game_action.outs,
            inning: game_action.inning
        },
        change_out_player : false,
        toggle_at_bat : false,
        game_over : false
    };

    if(game_result == 'strike' || (game_result == 'foul' && returnObj.counts.strikes != 2)){
        returnObj.counts.strikes++;
    }else if(game_result == 'ball'){
        //TODO: Walk the player if a ball happens?
        returnObj.counts.balls++;
        if(returnObj.counts.balls>=4){
            returnObj.counts.balls = 0;
            returnObj.counts.strikes = 0;
        }
    }else if(game_result == 'out'){
        returnObj.counts.balls = 0;
        returnObj.counts.strikes = 0;

        returnObj.change_out_player = true;
        returnObj.counts.outs++;

    }
    else if(game_result == 'foul' && returnObj.counts.strikes == 2){
        //Do nothing
    }else{
        returnObj.counts.balls = 0;
        returnObj.counts.strikes = 0;
    }

    if(returnObj.counts.strikes >= 3){
        returnObj.counts.strikes = 0;
        returnObj.counts.outs++;
    }

    if(returnObj.counts.outs>=3){
        returnObj.counts.outs = 0;
        returnObj.counts.strikes = 0;
        returnObj.counts.balls = 0;
        returnObj.counts.inning++;
        returnObj.toggle_at_bat = true;
    }

    if(returnObj.counts.inning == 18){
        returnObj.game_over = true;
    }

    return returnObj;
}

function updateCountsByEventResult(game, game_action, game_result){
    return new Promise(function(resolve, reject){
        var newCounts = exports.calculateCountsByEventResult(game, game_action, game_result);

        GameActionModel.update(game_action.id, newCounts.counts).then(function(new_game_action){
            var actions = [];

            if(newCounts.change_out_player === true){
                actions.push(updateGameLineupByResult(game.id));
            }

            if(newCounts.game_over === true){
                actions.push(GameActionModel.createFromPrevious(game_action.game_id,'end', 'Game Over!'));
            }

            if(newCounts.toggle_at_bat === true){
                actions.push(toggleTeamAtBat(game, game_action));
            }

            Promise.each(actions, function(){}).then(function(result){
                resolve(new_game_action);
            }).catch(function(err){
                reject(err);
            });
        });
    });
}

function updateGameLineupByResult(game_id) {
    return new Promise(function (resolve, reject) {
        GameActionModel.getLatestByGameId(game_id).then(function (game_event) {
            LineupModel.getByGameAndTeamId(game_id, game_event.team_at_bat).then(function(lineup){
                LineupModel.getNextLineupPlayerByLineupId(lineup.id).then(function(player){
                    LineupModel.markLastPlayerAsPlayed(game_id, player.id, game_event.team_at_bat).then(function(result){
                        resolve(result);
                    }).catch(function(err){
                        reject(err);
                    });
                }).catch(function(err){
                    reject(err);
                });
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.startGame = function(game_id){
    return new Promise(function(resolve, reject){
        if(game_id) {
            Promise.all([GameModel.getById(game_id), ApprovalModel.checkApprovalStatusByItemAndId('games', game_id)]).spread(function (game, status) {
                if(status === true){
                    Promise.all([ApprovalModel.checkApprovalStatusByItemAndId('games', game_id), isGameStarted(game_id)]).then(function(result){
                        GameActionModel.create(game_id, game.team1_id, 'start', 'Game Started!').then(function(game_action){
                            Promise.all(LineupController.setDefaultLineup(game.team1_id, game_id), LineupController.setDefaultLineup(game.team2_id, game_id), createInitialGamePlayerPositions(game_action.id)).then(function(result){
                                resolve(game_action);
                            }).catch(function(err){
                                reject(err);
                            });
                        }).catch(function(err){
                            reject(err);
                        });
                    }).catch(function(err){
                        reject(err);
                    });
                }else{
                    reject("All players must approve");
                }
            }).catch(function (err) {
                reject(err);
            });
        }else{
            reject("Game ID is required");
        }
    });
}

exports.doGameEvent = function(game_id){
    return new Promise(function(resolve, reject){
        Promise.all([ApprovalsController.hasNoOutstandingApprovals('games', game_id), GameModel.hasEventWithType(game_id, 'start')]).spread(function(allApproved, status){
            if(allApproved === true && status === true){

                Promise.all([GameModel.getById(game_id), GameActionModel.getLatestByGameId(game_id)]).spread(function(game, game_action){
                    var other_team_id = 0;
                    if(game.team1_id === game_action.team_at_bat){
                        other_team_id = game.team2_id;
                    }else{
                        other_team_id = game.team1_id;
                    }

                    Promise.all([LineupController.getNextLineupPlayerByGameAndTeamId(game.id, game_action.team_at_bat), LineupController.getLineupPitcherByGameAndTeamId(game.id, other_team_id)]).spread(function(player1, player2){
                        doGameEventLogic(game, game_action, player1, player2).then(function(new_game_action){
                            ApprovalsController.createGameApprovalByLastGameAction(new_game_action.id).then(function(approval){
                                resolve(new_game_action);
                            }).catch(function(err){
                               reject(err);
                            });
                        }).catch(function(err){
                           reject(err);
                        });
                    }).catch(function(err){
                        reject(err);
                    });
                }).catch(function(err){
                   reject(err);
                });
            }else{
                if(allApproved === false){
                    reject("Waiting on Approvals...");
                }else{
                    reject("Game Not Yet Started");
                }
            }
        }).catch(function(err){
            reject("" + err);
        });
    });
}

function doGameEventLogic(game, last_game_action, player1, player2){
    return new Promise(function(resolve, reject){
        if(last_game_action == undefined){
            reject("The game has not been started");
        }else if (last_game_action.type == 'end' && last_game_action != undefined) {
            reject("The game has ended");
        }else{
            gameAlgorithmController(game, player1, player2).then(function(action_result){
                var game_message = generateMessage(player1, player2, game, action_result);
                GameActionModel.createFromPrevious(game.id, action_result, game_message).then(function(game_action){
                    PlayerPositionModel.createCopy(last_game_action.id, game_action.id).then(function(player_position){
                        Promise.each([updatePlayerPositionByEventResult(game, game_action, player_position, player1, action_result),updateCountsByEventResult(game, game_action, action_result)], function(){}).then(function(result){
                            resolve(game_action);
                        }).catch(function(err){
                            reject("" + err);
                        });
                    }).catch(function(err){
                        reject("" + err);
                    });
                }).catch(function(err){
                   reject("" + err);
                });
            }).catch(function(err){
                reject("" + err);
            });
        }
    });
}

function generateMessage(player1, player2, game, game_result){
    var player1_name = player1.firstname + " " + player1.lastname;
    var player2_name = player2.firstname + " " + player2.lastname;

    return "Player " + player1_name + " got a " + game_result + " against " + player2_name;
}

/*
 * Different method of doing the basicPlayerEvent, uses game_id instead of only players
 * Not working
 */
function gameAlgorithmController(game, player1, player2) {
    return new Promise(function(resolve, reject) {
        Promise.all([PlayerModel.getAttributesById(player1.id),PlayerModel.getAttributesById(player2.id)]).spread(function(player1_stat, player2_stat){
            resolve(exports.basicPlayerEvent(player1, player1_stat, player2, player2_stat));
        }).catch(function(err){
            reject(err);
        });
    }).catch(function(err){
        reject(err);
    });
}

exports.basicPlayerEvent = function(player1, player1_attr, player2, player2_attr, rand){
    var totalattrs = 0;
    var max = 100 + totalattrs;
    var min = 0;

    // Base chance for each outcome

    var ball = 25;
    var single = 10;
    var double = 5;
    var triple = 3;
    var home_run = 2;

    var strike = 25;
    var out = 20;
    var foul = 20;

    var outcome = ' ';
    var options = ['ball', 'single', 'double', 'triple', 'home_run', 'strike', 'out', 'foul', 'strike_out', 'walk'];

    // Attributes
    var technique = player2_attr.technique;
    var pitch_speed = player2_attr.pitch_speed;
    var endurance = player2_attr.endurance;

    var contact = player1_attr.contact;
    var swing_speed = player1_attr.swing_speed;
    var bat_power = player1_attr.bat_power;

    // Stats
    var hits = 0;
    var hits_allowed = 0;
    var at_bats = 0;
    var innings_pitched = 0;
    var doubles = 0;
    var triples = 0;
    var homeruns = 0;

    totalattrs = contact + swing_speed + bat_power + technique + pitch_speed
        + endurance;

    //Batter
    ball += ((.7 * swing_speed));
    single += ((.15 * swing_speed) + (.6 * contact));
    double += ((.3 * bat_power) + (.15 * swing_speed) + (.4 * contact));
    home_run += (.4 * bat_power);

    //Pitcher
    strike += ((.4 * endurance) + (technique));
    out += ((.3 * endurance) + (.5 * pitch_speed));
    foul += ((.5 * pitch_speed) + (.3 * endurance));

    // Selection of RNG
    var rng = 0;
    var num = 0;

    if(isNaN(rand) != true){
        num = rand + totalattrs;
    }else{
        num = Math.floor(Math.random() * 100 + totalattrs);
    }

    //console.log('Choosing Outcome: ' + num);
    if (num >= 0 && num < ball) {
        // Returns Ball
        rng = 0;
    }
    else if (num >= ball && num < ball + single) {
        // Returns Single
        rng = 1;
    }
    else if (num >= ball + single && num < (ball + single + double)) {
        // Returns Double
        rng = 2;
    }
    else if (num >= (ball + single + double) && num < (ball + single + double + triple)) {
        // Returns Triple
        rng = 3;
    }
    else if (num >= (ball + single + double + triple) && num < (ball + single + double + triple + home_run)) {
        // Returns Home Run
        rng = 4;
    }
    else if (num >= (ball + single + double + triple + home_run) && num < (ball + single + double + triple + home_run + strike)) {
        // Returns Strike
        rng = 5;
    }
    else if (num >= (ball + single + double + triple + home_run + strike) && num < (ball + single + double + triple + home_run + strike + out)) {
        // Returns Out
        rng = 6;
    }
    else if (num >= (ball + single + double + triple + home_run + strike + out) && num < (totalattrs + 100)) {
        // Returns Foul
        rng = 7;
    }
    outcome = options[rng];

    return outcome;
}

function checkAllForApprovalStatus(approvals){
    var approvals = approvals.filter(function(item){
        return item.approved != 'approved';
    });
    return approvals.length == 0;
}

/**
 * Things to keep track of during the game:
 * - Inning
 * - Out(s)
 * - # of Balls
 * - # of Strikes
 * - Runners on base
 * - Score
 * - Stats
 * - # of Hits (per team)
 * - # of Errors (per team) *for later*
 */
