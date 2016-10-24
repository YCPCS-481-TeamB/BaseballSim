var Promise = require('bluebird').Promise;
var DatabaseController = require('./DatabaseController');
var TeamsController = require('./TeamsController');

exports.setDefaultLineup = function(team_id, game_id){
    return new Promise(function(resolve, reject){
        exports.createLineup(team_id, game_id).then(function(lineup){
            TeamsController.getPlayersByTeamId(team_id).then(function(players){
                var promises = [];
                for(var i = 0;i<players.length;i++){
                    promises.push(exports.setLineupPosition(lineup.id, players[i].id, (i+1)));
                }
                Promise.all(promises).then(function(result){
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
    });
}

exports.getNextLineupPlayerByGameAndTeamId = function(game_id, team_id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * FROM players WHERE id IN (SELECT player_id FROM lineup_items WHERE already_played = false AND lineup_id IN (SELECT id FROM lineups WHERE game_id = $1 AND team_id = $2) ORDER BY lineup_index ASC LIMIT 1)",[game_id, team_id]).then(function(result){
            console.log(result.rows);
            if(result.rows.length > 0){
                DatabaseController.query("UPDATE lineup_items SET already_played = true WHERE (player_id = $1 AND lineup_id IN (SELECT id FROM lineups WHERE game_id=$2 AND team_id=$3))", [result.rows[0].id, game_id, team_id]).then(function(data){
                    resolve(result.rows[0]);
                }).catch(function(err){
                    reject(err);
                });
            }else{
                reject("No Players Left To Play");
            }
        }).catch(function(err){
           reject(err);
        });
    });
}

exports.getLineupByGameAndTeamId = function(game_id, team_id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * FROM lineup_items WHERE lineup_id in (SELECT id FROM lineups WHERE game_id=$1 AND team_id=$2) ORDER BY lineup_index ASC",[game_id, team_id]).then(function(result){
            resolve(result.rows);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getLineupByGameAndUserId = function(game_id, team_id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * FROM lineup_items WHERE lineup_id in (SELECT id FROM lineups WHERE game_id=$1 AND team_id IN (SELECT id FROM teams WHERE id in (SELECT item_id FROM permissions WHERE item_type='teams' AND user_id=$2))) ORDER BY lineup_index ASC",[game_id, user_id]).then(function(result){
            resolve(result.rows);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.createLineup = function(team_id, game_id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("INSERT INTO lineups (team_id, game_id) VALUES ($1, $2) RETURNING *", [team_id, game_id]).then(function(result){
            resolve(result.rows[0]);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getLineupById = function(lineup_id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * FROM lineup_items WHERE lineup_id=$1 ORDER BY lineup_index ASC;", [lineup_id]).then(function(result){
            resolve(result.rows);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.setLineupPosition = function(lineup_id, player_id, lineup_index){
    return new Promise(function(resolve, reject){
        DatabaseController.query("INSERT INTO lineup_items (lineup_id, player_id, lineup_index) VALUES ($1, $2, $3) RETURNING *", [lineup_id, player_id, lineup_index]).then(function(result){
            resolve(result.rows[0]);
        }).catch(function(err){
            reject(err);
        });
    });
}