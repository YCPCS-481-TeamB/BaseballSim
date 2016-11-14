var bluebird = require('bluebird');
var Promise = bluebird.Promise;
//var DatabaseController = require('./DatabaseController');
var GameModel = require('./../Models/Game');
var LineupModel = require('./../Models/Lineup');
var GameActionModel = require('./../Models/GameAction');
var PlayerPositionModel = require('./../Models/PlayerPosition');
var ApprovalModel = require('./../Models/Approval');

var PlayerModel = require('./../Models/Player');
var PlayerController = require('./PlayersController');
var ApprovalsController = require('./ApprovalsController');
var PermissionController = require('./PermissionController');
var TeamsController = require('./TeamsController');
var LineupController = require('./LineupController');

exports.createGame = function(team1_id, team2_id, field_id, league_id){
    return new Promise(function(resolve, reject){
        if(team1_id && team2_id){
            GameModel.create(team1_id,team2_id, field_id, league_id).then(function(game){
                //console.log(game);
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

function toggleTeamAtBat(game_action_id){
    return new Promise(function(resolve, reject){
       GameActionModel.getById(game_action_id).then(function(game_action){

           GameModel.getById(game_action.game_id).then(function(game){
               var newTeamAtBat = 0;
               if(game.team1_id == game_action.team_at_bat){
                   newTeamAtBat = game.team2_id;
               }else{
                   newTeamAtBat = game.team1_id;
               }

               GameActionModel.update(game_action_id, {team_at_bat: newTeamAtBat}).then(function(result){
                   PlayerPositionModel.getByGameActionId(game_action_id).then(function(player_position){
                       PlayerPositionModel.clearBasesById(player_position.id).then(function(clear_bases_position){
                           console.log("UPDATE TOGGLE AT BAT: ", result);
                           resolve(result);
                       }).catch(function(err){
                            reject("clear bases: " + err);
                       });
                   }).catch(function(err){
                      reject("get player position: " + err);
                   });
               }).catch(function(err){
                  reject("Update GameAction: " + err);
               });
           }).catch(function(err){
                reject("Get Game: " + err);
           });
       }).catch(function(err){
            reject("Get GameAction: " + err);
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

function updatePlayerPositionByEventResult(game_action_id, player_id, game_result){
    //'home_run', 'walk', 'triple', 'double', 'single'
    return new Promise(function(resolve, reject){
        GameActionModel.getById(game_action_id).then(function(game_action){
            PlayerPositionModel.getByGameActionId(game_action.id).then(function(player_positions){
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
                PlayerPositionModel.update(player_positions.id, {onfirst_id: player_pos_arr[0], onsecond_id: player_pos_arr[1], onthird_id: player_pos_arr[2]}).then(function(updated_player_position){
                    updateGameScore(game_action_id, score).then(function(data) {
                        if (changeoutplayer === true) {
                            updateGameLineupByResult(game_action.game_id).then(function(lineup_data){
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
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

//function updateTeamToggle(game_action_id, game_result){}

function updateCountsByEventResult(game_action_id, player_id, game_result){
    //'ball', 'strike', 'foul'
    return new Promise(function(resolve, reject){
        GameActionModel.getById(game_action_id).then(function(game_action){
            var balls = game_action.balls;
            var strikes = game_action.strikes;
            var outs = game_action.outs;
            var inning = game_action.inning;

            var changeoutplayer = false;
            var toggleAtBat = false;
            var gameOver = false;

            if(game_result == 'strike' || (game_result == 'foul' && strikes != 2)){
                strikes++;
                if (strikes >= 3){
                    // Strikeout
                    strikes = 0;
                    balls = 0;
                    changeoutplayer = true;
                    outs++;
                    if (outs >= 3 && outs != 0) {
                        // Swap Teams here maybe?
                        inning += 1;
                        toggleAtBat = true;
                        outs = 0;
                        balls = 0;
                        if (inning == 18){
                            // Game Over
                        }
                    }
                }
            }else if(game_result == 'ball'){
                balls++;
                if (balls >= 4) {
                    // Walk
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
                    toggleAtBat = true;
                    outs = 0;
                    balls = 0;
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
                        if(gameOver === true){
                            GameActionModel.createFromPrevious(game_action.game_id, 'end', 'Game Over!').then(function(end_action){
                                if(toggleAtBat === true){
                                    toggleTeamAtBat(game_action.id).then(function(at_bat_toggle_action){
                                        resolve(result);
                                    }).catch(function(err){
                                        reject("toggle team: ", err);
                                    });
                                }else{
                                    resolve(result);
                                }
                            }).catch(function(err){
                               reject("Create from prev: ", err);
                            });
                        }else{
                            if(gameOver === true) {
                                GameActionModel.createFromPrevious(game_action.game_id, 'end', 'Game Over!').then(function (end_action) {
                                    resolve(result);
                                }).catch(function (err) {
                                    reject("game over?", err);
                                });
                            }else{
                                if(toggleAtBat === true){
                                    toggleTeamAtBat(game_action.id).then(function(at_bat_toggle_action){
                                        resolve(result);
                                    }).catch(function(err){
                                        reject("Toggle at bat: ", err);
                                    });
                                }else{
                                    resolve(result);
                                }
                            }
                        }

                    }).catch(function(err){
                        reject("Error updating game lineup: " + err)
                    });
                }else {
                    resolve(result);
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

function createApprovalsForEvent(game_id, event_id){
   return new Promise(function(resolve, reject){
       var promises = [];
       PermissionController.getOwnerForItem('games', game_id).then(function(data){
           var users = data.rows;
           for(var i = 0;i<data.rows.length;i++){
               promises.push(ApprovalsController.createApproval('events', event_id, users[i].user_id));
           }
           Promise.all(promises).then(function(data){
                //console.log(data);
                resolve(data);
           }).catch(function(err){
               reject(err);
                //console.log(err);
           });
       }).catch(function(err){
           reject(err);
           //console.log(err);
       });
   });
}

exports.startGame = function(game_id){
    return new Promise(function(resolve, reject){
        if(game_id){
            GameModel.getById(game_id).then(function(game){
                ApprovalModel.checkApprovalStatusByItemAndId('games', game_id).then(function(status){
                    if(status == true){
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
                            //console.log(err);
                        });
                    }else{
                        reject("All players must approve");
                    }
                }).catch(function(err){
                    reject(err);
                });
            }).catch(function(err){
               reject(err);
            });
        }else{
            reject("Game ID is Required");
        }
    });
}

exports.doGameEvent = function(game_id, player1_id, player2_id) {
    return new Promise(function (resolve, reject) {
        GameModel.hasEventWithType(game_id, 'start').then(function(status){
            if(status == true){
                if(player1_id == undefined || player2_id == undefined){
                    GameActionModel.getLatestByGameId(game_id).then(function (gameEvent) {
                        GameModel.getById(game_id).then(function(game){
                            var other_team_id = 0;
                            if(game.team1_id == gameEvent.team_at_bat){
                                other_team_id = game.team2_id;
                            }else{
                                other_team_id = game.team1_id;
                            }
                            Promise.all([LineupController.getNextLineupPlayerByGameAndTeamId(game_id, gameEvent.team_at_bat), LineupController.getNextLineupPlayerByGameAndTeamId(game_id, other_team_id)]).then(function (result) {
                                var player1_id = result[0].id;
                                var player2_id = result[1].id;

                                doGameEventLogic(game_id,player1_id, player2_id).then(function(game_action){
                                    resolve(game_action);
                                }).catch(function(err){
                                    reject(err);
                                });
                            }).catch(function (err) {
                                reject(err);
                            });
                        }).catch(function(err){
                            reject(err);
                        });
                    });
                }else{
                    doGameEventLogic(game_id, player1_id, player2_id).then(function(game_action){
                        resolve(game_action);
                    }).catch(function(err){
                        reject(err);
                    });
                }
            }else{
                reject("Game Not Started");
            }
        }).catch(function(err){
           reject(err);
        });
    });
}

function doGameEventLogic(game_id, player1_id, player2_id){
    return new Promise(function(resolve, reject){
        GameActionModel.getLatestByGameId(game_id).then(function(lastGameEvent){
            if (lastGameEvent == undefined) {
                reject("Game has not been started");
            }else if (lastGameEvent.type == 'end' && lastGameEvent != undefined) {
                reject("The game has ended");
            }else{
                basicPlayerEvent(player1_id, player2_id).then(function(result) {
                    var game_message = "";
                    generateMessage(player1_id, player2_id, game_id, result).then(function(msg){
                        game_message = msg;
                        GameActionModel.createFromPrevious(game_id, result, game_message).then(function(game_action){
                            PlayerPositionModel.createCopy(lastGameEvent.id, game_action.id).then(function(copyResult){
                                updatePlayerPositionByEventResult(game_action.id, player1_id, result).then(function(playerPosResult){
                                    updateCountsByEventResult(game_action.id, player1_id, result).then(function(countsResult){
                                            resolve(game_action);
                                    }).catch(function(err){
                                        reject("Update Counts: "+ err);
                                    });
                                }).catch(function(err){
                                    reject("Player Position: "+ err);
                                });
                            }).catch(function(err){
                                reject("Create Copy: "+ err);
                            });
                        }).catch(function(err){
                            reject("Create from previous: "+ err);
                        });
                    }).catch(function(err){
                        reject(err);
                    })

                }).catch(function(err){
                    reject("Basic Player Event: "+ err);
                });
            }
        }).catch(function(err){
            reject("Get latest game event: "+ err);
        });
    });
}

function generateMessage(player1_id, player2_id, game_id, game_result){
    return new Promise(function(resolve, reject){
        Promise.all([PlayerModel.getById(player1_id), PlayerModel.getById(player2_id)]).then(function(result){
            var player1_name = result[0].firstname + " " + result[0].lastname;
            var player2_name = result[1].firstname + " " + result[1].lastname;
            resolve("Player " + player1_name + " ("+result[0].id+") got a " + game_result + " against " + player2_name+ " ("+result[1].id+")");
        }).catch(function(err){
            reject(err);
        });
    });
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
       // console.log(player1_id, player2_id);
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
                //console.log("Player 1: ", player1);
                //console.log("Player 2: ", player2);

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

                // Tracks stats based on outcome
                PlayerController.statTracker(player1, player2, options[rng]);
               // console.log("OUTCOME", outcome);
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
