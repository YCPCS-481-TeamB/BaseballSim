var DatabaseController = require('./DatabaseController');

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
                resolve(data.rows);
            }).catch(function(err){
                reject(err);
            });
        }else {
            reject("Must have 2 teams in a game!");
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

/*
exports.batterVsPitcherEvent = function(player1, player2) {
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
