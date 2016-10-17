var Promise = require('bluebird').Promise;
var DatabaseController = require('./DatabaseController');
var TeamsController = require('./TeamsController');

exports.setDefaultLineup = function(team_id, game_action_id){
    return new Promise(function(resolve, reject){
        exports.createLineup(team_id, game_action_id).then(function(lineup){
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

exports.createLineup = function(team_id, game_action_id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("INSERT INTO lineups (team_id, game_action_id) VALUES ($1, $2) RETURNING *", [team_id, game_action_id]).then(function(result){
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