var DatabaseController = require('./DatabaseController');

var PlayerController = require('./PlayersController');

exports.getGames = function(limit, offset){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * from games LIMIT $1 OFFSET $2", [limit | 1000, offset | 0]).then(function(data){
            resolve({games: data.rows});
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
                var max = 7;
                var min = 0;
                var num = Math.random() * (max - min) + min;
                var options = ['home_run', 'walk', 'triple', 'double', 'single', 'ball', 'strike', 'foul'];
                console.log("RAND: " + num);
                resolve(options[Math.floor(num)]);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

/*
batterVsPitcherEvent = function(player1, player2) {
    // SIMPLE Outcomes
    var outcomes = ['out', 'hit', 'strike', 'ball'];
    // Math giving Pitcher or Batter Adv
    var player1Stats = player1.getStats(); // Technique-Pitch_Speed-Endurance
    var player2Stats = player2.getStats(); // Contact-Swing_Speed-Power
    var truePitch = (player1.technique * 0.01 + player1.pitch_speed * 0.01 + player1.endurance * 0.01);
    // Endurance Decreases over time 'Batter gets advantage over time'
    var trueBat = (player2.contact * 0.01 + player2.swing_speed * 0.01 + player2.bat_power * 0.01);
    var event = truePitch - trueBat;
    if (event > 0) { // Pitcher has Advantage
        // Outcome favorable to pitcher
    }
    else {
        // Outcome favorable to batter
    }
}
*/
