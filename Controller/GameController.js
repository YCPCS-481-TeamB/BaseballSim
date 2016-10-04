var bluebird = require('bluebird');
var Promise = bluebird.Promise;
var DatabaseController = require('./DatabaseController');

var PlayerController = require('./PlayersController');

exports.getGames = function(limit, offset){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * from games LIMIT $1 OFFSET $2", [limit | 1000, offset | 0]).then(function(data){
            resolve(data.rows);
        }).catch(function(err){
            reject(err);
        });

    });
}

exports.getGameByUserId = function(user_id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * from games WHERE id in (SELECT item_id FROM permissions WHERE item_type='games' AND user_id=$1)", [user_id]).then(function(data){
            resolve(data.rows);
        }).catch(function(err){
            reject(err);
        });

    });
}

exports.createGame = function(team1_id, team2_id, field_id, league_id){
    return new Promise(function(resolve, reject){
        if(team1_id && team2_id){
            DatabaseController.query("INSERT INTO games (team1_id, team2_id, field_id, league_id) VALUES ($1, $2, $3, $4) RETURNING *", [team1_id, team2_id, field_id | 0, league_id | 0]).then(function(data){
                resolve(data.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        }else {
            reject("Must have 2 teams in a game!");
        }
    });
}

exports.getEventsByGameId = function(game_id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * FROM game_action WHERE game_id = $1", [game_id]).then(function(data){
            resolve(data.rows);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.isGameStarted = function(game_id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * FROM game_action WHERE game_id = $1 AND type = 'start'", [game_id]).then(function(data){
            if(data.rows.length > 0){
                resolve({started: true, game_action: data.rows})
            }else{
                resolve({started: false});
            }
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getPlayerPositionByGameEventId = function(game_event_id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * from game_player_positions WHERE game_action_id = $1", [game_event_id]).then(function(result){
            resolve(result.rows[0]);
        }).catch(function(err){
            reject(err);
        });
    });
}


function addPlayerPosition(game_action_id, firstbase_player_id, secondbase_player_id, thirdbase_player_id){
    return DatabaseController.query("INSERT INTO game_player_positions (game_action_id, onfirst_id, onsecond_id, onthird_id) VALUES ($1, $2, $3, $4)", [game_action_id, firstbase_player_id, secondbase_player_id, thirdbase_player_id]);
}

exports.startGame = function(game_id){
    return new Promise(function(resolve, reject){
        if(game_id){
            exports.isGameStarted(game_id).then(function(data){
                if(data.started == false){
                    DatabaseController.query("INSERT INTO game_action (game_id, team1_score, team2_score, type, message) VALUES ($1, 0, 0, 'start', 'Game Started!') RETURNING *", [game_id]).then(function(data){
                        var game_event = data.rows[0];
                        addPlayerPosition(game_event.id, 0, 0, 0).then(function(data){
                            resolve(game_event);
                        }).catch(function(err){
                           reject(err);
                        });
                    }).catch(function(err){
                        reject(err);
                    });
                }else{
                    reject("Game \'" + game_id + "\' is already started");
                }
            }).catch(function(err){
                reject(err);
            })
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

exports.deleteGamesById = function(id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("DELETE FROM games WHERE id = $1 RETURNING *;", [id]).then(function(data){
            resolve({game: data.rows});
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getGameById = function(id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * from games WHERE id = $1", [id]).then(function(data){
            resolve(data.rows);
        });
    });
}

exports.doGameEvent = function(game_id, player1_id, player2_id){
    return new Promise(function(resolve, reject){
        basicPlayerEvent(player1_id, player2_id).then(function(result){
            var game_message = generateMessage(player1_id, player2_id, game_id, result);
            DatabaseController.query("INSERT INTO game_action (game_id, team1_score, team2_score, type, message) VALUES ($1, 0, 0, $2, $3) RETURNING *", [game_id, result, game_message]).then(function(data){
                resolve(data.rows);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

function generateMessage(player1_id, player2_id, game_id, result){
    return "Player " + player1_id + " got a " + result + " against " + player2_id;
}

//'home_run', 'walk', 'triple', 'double', 'single', 'ball', 'strike', 'foul'
function calculateNewPlayerPositions(obj_prev_pos, event){
    var player_pos = {onfirst_id: 0, onsecond_id: 0, onthird_id: 0};

    if(event == 'home_run'){
        return player_pos;
    }else{

    }
}

//function getNumStrikes(game_id)

/**
 * Should Return any of 'home_run', 'walk', 'triple', 'double', 'single', 'ball', 'strike', 'foul'
 * @param player1_id
 * @param player2_id
 * @returns {Promise}
 */
function basicPlayerEvent(player1_id, player2_id){
    return new Promise(function(resolve, reject){
        PlayerController.getPlayersById(player1_id).then(function(player1){
            PlayerController.getPlayersById(player2_id).then(function(player2){
                console.log("TEST");
                var totalattrs;
                var max = 105 + totalattrs;
                var min = 0;

                // Base chance for each outcome

                var ball = 25;
                var single = 10;
                var double = 5;
                var triple = 3;
                var home_run = 2;

                var strike = 25;
                var out = 15;
                var foul = 20;

                // Get the Attributes for Players 1 & 2
                /*
                var player1attrs, player2attrs;
                PlayerController.getPlayerAttributesById(player1_id).then(function(data){
                    player1attrs = data;
                }).catch(function(err){
                    reject(err);
                });

                PlayerController.getPlayerAttributesById(player2_id).then(function(data){
                    player2attrs = data;
                }).catch(function(err){
                    reject(err);
                });
                */
                Promise.all([PlayerController.getPlayerAttributesById(player1_id),PlayerController.getPlayerAttributesById(player2_id)]).spread(function(player1, player2){
                    console.log("TEST2");
                    console.log(player1);
                    var technique = player2.technique;
                    var pitch_speed = player2.pitch_speed;
                    var endurance = player2.endurance;

                    var contact = player1.contact;
                    var swing_speed = player1.swing_speed;
                    var bat_power = player1.bat_power;


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
                    var num = Math.floor(Math.random() * 100+totalattrs);
                    console.log(num);
                    if (num >= 0  && num < ball){
                        // Returns Ball
                        rng = 0;
                    }
                    else if (num >= ball && num < ball+single){
                        // Returns Single
                        rng = 1;
                    }
                    else if (num >= ball+single && num < (ball+single+double)) {
                        // Returns Double
                        rng = 2;
                    }
                    else if (num >= (ball+single+double) && num < (ball+single+double+triple)) {
                        // Returns Triple
                        rng = 3;
                    }
                    else if (num >= (ball+single+double+triple) && num < (ball+single+double+triple+home_run)) {
                        // Returns Home Run
                        rng = 4;
                    }
                    else if (num >= (ball+single+double+triple+home_run) && num < (ball+single+double+triple+home_run+strike)) {
                        // Returns Strike
                        rng = 5;
                    }
                    else if (num >= (ball+single+double+triple+home_run+strike) && num < (ball+single+double+triple+home_run+strike+out)) {
                        // Returns Out
                        rng = 6;
                    }
                    else if (num >= (ball+single+double+triple+home_run+strike+out) && num < totalattrs){
                        // Returns Foul
                        rng = 7;
                    }

                    var options = ['ball', 'single', 'double', 'triple', 'home_run', 'strike', 'out', 'foul'];
                    console.log("RAND: " + rng);
                    resolve(options[rng]);
                });
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
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

