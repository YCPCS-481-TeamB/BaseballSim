var bluebird = require('bluebird');
var Promise = bluebird.Promise;
//var DatabaseController = require('./DatabaseController');
var GameModel = require('./../Models/Game');
var GameActionModel = require('./../Models/GameAction');
var PlayerPositionModel = require('./../Models/PlayerPosition');
var ApprovalModel = require('./../Models/Approval');

var PlayerModel = require('./../Models/Player');
var PlayerController = require('./PlayersController');
var ApprovalsController = require('./ApprovalsController');
var PermissionController = require('./PermissionController');
var TeamsController = require('./TeamsController');
var LineupController = require('./LineupController');

// Don't yell at me Brandon I wanted some global variables
//var numBalls = 0;
//var numStrikes = 0;
//exports.getGames = function(limit, offset){
//    return new Promise(function(resolve, reject){
//        DatabaseController.query("SELECT * from games LIMIT $1 OFFSET $2", [limit | 1000, offset | 0]).then(function(data){
//            resolve(data.rows);
//        }).catch(function(err){
//            reject(err);
//        });
//    });
//}

//TODO: Remove
//exports.getGameByUserId = function(user_id){
//    return new Promise(function(resolve, reject){
//        DatabaseController.query("SELECT * from games WHERE id in (SELECT item_id FROM permissions WHERE item_type='games' AND user_id=$1)", [user_id]).then(function(data){
//            resolve(data.rows);
//        }).catch(function(err){
//            reject(err);
//        });
//    });
//}

exports.createGame = function(team1_id, team2_id, field_id, league_id){
    return new Promise(function(resolve, reject){
        if(team1_id && team2_id){
            GameModel.create(team1_id,team2_id, field_id, league_id).then(function(game){
                console.log(game);
                Promise.all([PermissionController.getOwnerForItem('teams', team1_id), PermissionController.getOwnerForItem('teams', team2_id)]).then(function(result){
                    var user1_id = result[0].rows[0].user_id;
                    var user2_id = result[1].rows[0].user_id;
                    Promise.all([ApprovalsController.createApproval('games', game.id, user2_id), PermissionController.addPermission('games', game.id, user1_id), PermissionController.addPermission('games', game.id, user2_id)]).then(function(result){
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

//exports.getEventsByGameId = function(game_id){
//    return new Promise(function(resolve, reject){
//        DatabaseController.query("SELECT * FROM game_action WHERE game_id = $1", [game_id]).then(function(data){
//            resolve(data.rows);
//        }).catch(function(err){
//            reject(err);
//        });
//    });
//}

function isGameStarted(game_id){
    return new Promise(function(resolve, reject){
        GameModel.hasEventWithType(game_id, 'start').then(function(result){
            resolve(result.length != 0);
        }).catch(function(err){
            reject(err);
        });
    });
}

//exports.getPlayerPositionByGameEventId = function(game_event_id){
//    return new Promise(function(resolve, reject){
//        DatabaseController.query("SELECT * from game_player_positions WHERE game_action_id = $1", [game_event_id]).then(function(result){
//            resolve(result.rows[0]);
//        }).catch(function(err){
//            reject(err);
//        });
//    });
//}

//function updatePlayerPosition(game_action_id, firstbase_player_id, secondbase_player_id, thirdbase_player_id){
//    return DatabaseController.query("INSERT INTO game_player_positions (game_action_id, onfirst_id, onsecond_id, onthird_id) VALUES ($1, $2, $3, $4)", [game_action_id, firstbase_player_id, secondbase_player_id, thirdbase_player_id]);
//}

function createInitialGamePlayerPositions(game_action_id){
    return new Promise(function(resolve, reject){
        PlayerPositionModel.create(game_action_id).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

//function copyPlayerPositions(lastActionId, currentActionId){
//    return new Promise(function(resolve, reject){
//        DatabaseController.query("INSERT INTO game_player_positions (game_action_id, onfirst_id, onsecond_id, onthird_id) SELECT $1, onfirst_id, onsecond_id, onthird_id FROM game_player_positions WHERE game_action_id = $2 RETURNING *", [currentActionId, lastActionId]).then(function(result){
//            resolve(result.rows[0]);
//        }).catch(function(err){
//            reject(err);
//        });
//    });
//}

//TODO: Update the method in other places
function updateGameScore(game_action_id, score){
    GameActionModel.getById(game_action_id).then(function(game_action){
        GameModel.getById(game_action.game_id).then(function(game){
            if(game.team1_id == game_action.team_at_bat){
                GameActionModel.update(game_action_id, {team1_score : score});
            }else{
                GameActionModel.update(game_action_id, {team2_score : score});
            }
        }).catch(function(err){
            reject(err);
        });
    }).catch(function(err){
        reject(err);
    });
}

function updatePlayerPositionByEventResult(game_action_id, player_id, game_result){
    //'home_run', 'walk', 'triple', 'double', 'single'
    return new Promise(function(resolve, reject){
        GameActionModel.getById(game_action_id).then(function(game_action){
            PlayerPositionModel.getByGameActionId(game_action.id).then(function(player_positions){
                console.log("player_positions: ", player_positions);
                var player_pos_arr = [player_positions.onfirst_id, player_positions.onsecond_id, player_positions.onthird_id];
                var movements = 0;

                var score = game_action.team1_score;

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

                //Update Player Positions
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
                        player_pos_arr[movements-1] = player_id;
                    }
                }
                console.log(player_pos_arr);
                PlayerPositionModel.update(player_positions.id, {onfirst_id: player_pos_arr[0], onsecond_id: player_pos_arr[1], onthird_id: player_pos_arr[2]}).then(function(updated_player_position){
                    updateGameScore(game_action_id, score).then(function(data) {
                        if (changeoutplayer === true) {
                            updateGameLineupByResult(game_action.game_id).then(function(lineup_data){
                                resolve(updated_player_position);
                            }).catch(function(err){
                                console.log(err);
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
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

function updateCountsByEventResult(game_action_id, player_id, game_result){
    //'ball', 'strike', 'foul'
    return new Promise(function(resolve, reject){
        GameActionModel.getById(game_action_id).then(function(data){
            var game_action = data.rows[0];
            var balls = game_action.balls;
            var strikes = game_action.strikes;
            var outs = game_action.outs;
            var inning = game_action.inning;

            var changeoutplayer = false;
            var gameOver = false;

            if(game_result == 'strike' || (game_result == 'foul' && strikes != 2)){
                strikes++;
                if (strikes >= 3){
                    // Strikeout
                    console.log("AND HE STRIKES OUT!")
                    strikes = 0;
                    balls = 0;
                    changeoutplayer = true;
                    outs++;
                    if (outs >= 3 && outs != 0) {
                        // Swap Teams here maybe?
                        inning += 1;
                        outs = 0;
                        balls = 0;
                        console.log("Current Inning: " + inning);
                        if (inning == 18){
                            // Game Over
                            console.log("GAME OVER");
                        }
                    }
                }
            }else if(game_result == 'ball'){
                balls++;
                if (balls >= 4) {
                    // Walk
                    console.log("AND HE WALKS!");
                    balls = 0;
                    strikes = 0;
                }
            }
            else if (game_result == 'foul' && strikes == 2) {
                strikes = 2;
            }
            else if(game_result == 'out'){
                strikes = 0;
                balls = 0;
                changeoutplayer = true;
                outs++;
                if (outs >= 3 && outs != 0) {
                    // Swap Teams here maybe?
                    inning += 1;
                    outs = 0;
                    balls = 0;
                    console.log("Current Inning: " + inning);
                }
            }
            // Result is a hit of some sort
            else {
                balls = 0;
                strikes = 0;
            }

            if (inning == 18){
                // Game Over
                gameOver = true;
            }

            GameActionModel.update(game_action_id, {balls: balls, strikes: strikes, outs: outs, inning: inning}).then(function(result){
                if(changeoutplayer === true){
                    updateGameLineupByResult(game_action.game_id).then(function(data){

                        //TODO: Add Game Event, 'end' if there are 18 innings played

                        if(gameOver === true){
                            //exports.
                        }else{

                        }

                        resolve(result.rows[0]);
                    }).catch(function(err){
                        reject("Error updating game lineup: " + err)
                    });
                }else {
                    resolve(result.rows[0]);
                }
            }).catch(function(err){
                reject("Error updating game action: " + err);
            });

        }).catch(function(err){
            reject("error getting game action: " + err);
        });
    });
}

function updateGameLineupByResult(game_id) {
    return new Promise(function (resolve, reject) {
        GameModel.getById(game_id).then(function (game) {
            GameActionModel.getLatestByGameId(game_id).then(function (game_event) {
                LineupController.getNextLineupPlayerByGameAndTeamId(game_id, game_event.team_at_bat).then(function(player){
                    LineupController.markLastPlayerAsPlayed(game_id, player.id, game_event.team_at_bat).then(function(result){
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
        }).catch(function (err) {
            reject(err);
        });
    });
}

function createApprovalsForEvent(game_id, event_id){
   return new Promise(function(resolve, reject){
       var promises = [];
       PermissionController.getOwnerForItem('games', game_id).then(function(data){
           var users = data.rows;
           for(var i = 0;i<data.rows.length;i++){
               promises.push(ApprovalsController.createApproval('events', event_id, users[i].user_id));
           }
           Promise.all(promises).then(function(data){
                console.log(data);
                resolve(data);
           }).catch(function(err){
                console.log(err);
           });
       }).catch(function(err){
           console.log(err);
       });
   });
}

//exports.getLatestEventForGame = function(game_id){
//    return new Promise(function(resolve, reject){
//        DatabaseController.query("SELECT * FROM game_action WHERE game_id=$1 ORDER BY date_created DESC LIMIT 1;", [game_id]).then(function(data){
//            resolve(data.rows[0]);
//        }).catch(function(err){
//            reject(err);
//        });
//    });
//}

exports.getLatestEventApprovalsForGame = function(game_id){
    return new Promise(function(resolve, reject){
        GameActionModel.getLatestByGameId(game_id).then(function(data){
            ApprovalsController.getApprovalByItemTypeAndId('events', data.id).then(function(approvals){
                resolve(approvals);
            }).catch(function(err){
              reject(err);
            })
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getLatestGameActionByGameId = function(game_id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * FROM game_action WHERE game_id = $1 ORDER BY date_created DESC LIMIT 1", [game_id]).then(function(result){
            resolve(result.rows[0]);
        }).catch(function(err){
            reject(err);
        });
    });
}

function createGameActionFromPrevious(game_id, result, game_message){
    return new Promise(function(resolve, reject){
        GameActionModel.getLatestByGameId(game_id).then(function(event){
            GameActionModel.createFromPrevious(game_id, result, game_message).then(function(result){
                resolve(result);
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
        if(game_id){
            GameModel.getById(game_id).then(function(game){
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
                    console.log(err);
                });
            }).catch(function(err){
                reject(err);
            });
        }else{
            reject("Game ID is Required");
        }
    });
}

exports.getActionsByGameId = function(game_id, limit, offset){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * from game_actions WHERE game_id=$3 LIMIT $1 OFFSET $2", [limit | 1000, offset | 0, game_id]).then(function(data){
            resolve(data.rows);
        }).catch(function(err){
            reject(err);
        });
    });
}
//
//exports.deleteGamesById = function(id){
//    return new Promise(function(resolve, reject){
//        DatabaseController.query("DELETE FROM games WHERE id = $1 RETURNING *;", [id]).then(function(data){
//            resolve({game: data.rows});
//        }).catch(function(err){
//            reject(err);
//        });
//    });
//}

exports.doGameEvent = function(game_id, player1_id, player2_id) {
    return new Promise(function (resolve, reject) {
        GameActionModel.getLatestByGameId(game_id).then(function(lastGameEvent){
            if (lastGameEvent == undefined) {
                reject("Game has not been started");
            }else if (lastGameEvent.type == 'end' && lastGameEvent != undefined) {
                reject("The game has ended");
            }else{
                basicPlayerEvent(player1_id, player2_id).then(function(result) {
                    var game_message = generateMessage(player1_id, player2_id, game_id, result)
                    createGameActionFromPrevious(game_id, result, game_message).then(function(game_action){
                        console.log("LAST GAME EVENT: ", lastGameEvent);
                        console.log("GAME ACTION: ", game_action);
                        Promise.each([PlayerPositionModel.createCopy(lastGameEvent.id, game_action.id),updateCountsByEventResult(game_action.id, player1_id, result), updatePlayerPositionByEventResult(game_action.id, player1_id, result)]).then(function(result){
                            resolve(game_action);
                        }).catch(function(err){
                            reject(err);
                        });
                    }).catch(function(err){
                        reject("error creating game action: " + err);
                    });
                }).catch(function(err){
                    reject("Error doing basic player event: " + err);
                });
            }
        }).catch(function(err){
            reject("Error getting last game: " + err);
        });
    });
}

function generateMessage(player1_id, player2_id, game_id, result){
    return "Player " + player1_id + " got a " + result + " against " + player2_id;
}

/*
 * Different method of doing the basicPlayerEvent, uses game_id instead of only players
 * Not working
 */
function gameAlgorithmController(game_id, player1_id, player2_id) {
    return new Promise(function(resolve, reject) {
        var team2 = game_id.team1_id;
        var team1 = game_id.team2_id;

        var player1 = player1_id;
        var player2 = player2_id;

        basicPlayerEvent(player1, player2);
    }).catch(function(err){
        reject(err);
    });
}

/**
 * Should Return any of 'home_run', 'walk', 'triple', 'double', 'single', 'ball', 'strike', 'foul' (Not 'strike_out' or 'walk')
 * @param player1_id (Batter)
 * @param player2_id (Pitcher)
 * @returns {Promise}
 * Calculates outcome based on player attributes
 */
function basicPlayerEvent(player1_id, player2_id){
    return new Promise(function(resolve, reject){

        Promise.all([PlayerModel.getById(player1_id), PlayerModel.getById(player2_id)]).then(function(result){
            var player1 = result[0];
            var player2 = result[1];

            var totalattrs;
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



            Promise.all([PlayerModel.getAttributesById(player1_id),PlayerModel.getAttributesById(player2_id)]).spread(function(player1, player2) {
                var outcome = ' ';
                var options = ['ball', 'single', 'double', 'triple', 'home_run', 'strike', 'out', 'foul', 'strike_out', 'walk'];

                // Attributes
                var technique = player2.technique;
                var pitch_speed = player2.pitch_speed;
                var endurance = player2.endurance;

                var contact = player1.contact;
                var swing_speed = player1.swing_speed;
                var bat_power = player1.bat_power;

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

                ball += ((.7 * swing_speed));
                single += ((.15 * swing_speed) + (.6 * contact));
                double += ((.3 * bat_power) + (.15 * swing_speed) + (.4 * contact));
                home_run += (.4 * bat_power);

                strike += ((.4 * endurance) + (technique));
                out += ((.3 * endurance) + (.5 * pitch_speed));
                foul += ((.5 * pitch_speed) + (.3 * endurance));

                // Selection of RNG
                var rng = 0;
                var num = Math.floor(Math.random() * 100 + totalattrs);
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
                    //outcome = exports.ballsAndStrikesCounter(options[rng]);
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
                console.log(totalattrs);
                outcome = options[rng];
                //console.log("RAND: " + outcome);

                // Tracks stats based on outcome
                PlayerController.statTracker(player1, player2, options[rng]);
                console.log("OUTCOME", outcome);
                resolve(outcome);

            }).catch(function(err){
                reject(err);
            });

        }).catch(function(err){
            reject(err);
        });
    });
}

function checkAllForApprovalStatus(approvals){
    var approvals = approvals.filter(function(item){
        return item.approved != 'approved';
    });
    return approvals.length == 0;
}

/*
 * params - outcome of basicPlayerEvent
 * returns - specific outcome after totaling balls & strikes
 * adds strike_out and walk outcome possibilities
 */
//exports.ballsAndStrikesCounter = function(outcome) {
//    console.log('Outcome: ' + outcome);
//    if (outcome == 'ball' && numBalls != 3) {
//        numBalls += 1;
//
//    }
//    else if (outcome == 'strike' && numStrikes != 2) {
//        numStrikes += 1;
//    }
//    else if (outcome == 'out') {
//        numStrikes = 0;
//        numBalls = 0;
//    }
//    else if (outcome == 'foul') {
//        if (numStrikes == 2) {
//            numStrikes = 2;
//        }
//        else {
//            numStrikes += 1;
//        }
//    }
//    else if (outcome == 'ball' && numBalls == 3) {
//        outcome = 'walk';
//        numBalls = 0;
//        numStrikes = 0;
//    }
//    else if (outcome == 'strike' && numStrikes == 2) {
//        outcome = 'strike_out';
//        numBalls = 0;
//        numStrikes = 0;
//    }
//    else {
//        numBalls = 0;
//        numStrikes = 0;
//        return outcome;
//    }
//    console.log('Count: ' + numBalls + ' balls, ' + numStrikes + ' strikes.');
//    //DatabaseController.query("INSERT INTO game_action
//    console.log('Outcome Final: ' + outcome);
//    return outcome;
//}
/*
exports.getStrikesAndBalls = function(outcome) {
    DatabaseController.query()
}
*/

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
