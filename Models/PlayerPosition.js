var bluebird = require('bluebird');
var Promise = bluebird.Promise;

var DatabaseController = require("./../Controller/DatabaseController");

module.exports =  {
    create : function(game_action_id, onfirst_id, onsecond_id, onthird_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("INSERT INTO game_player_positions (game_action_id, onfirst_id, onsecond_id, onthird_id) VALUES ($1, $2, $3, $4) RETURNING *", [game_action_id, onfirst_id | 0, onsecond_id | 0, onthird_id | 0]).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    createCopy : function(lastActionId, currentActionId){
        return new Promise(function(resolve, reject){
            DatabaseController.query("INSERT INTO game_player_positions (game_action_id, onfirst_id, onsecond_id, onthird_id) (SELECT $1, onfirst_id, onsecond_id, onthird_id FROM game_player_positions WHERE game_action_id = $2) RETURNING *", [currentActionId, lastActionId]).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    update : function(id, obj){
        return new Promise(function(resolve, reject){
            DatabaseController.update('game_player_positions', id, obj).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getAll : function(limit, offset){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * from game_player_positions LIMIT $1 OFFSET $2", [limit || 1000, offset || 0]).then(function(data){
                resolve(data.rows);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getById : function(id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * from game_player_positions WHERE id = $1", [id]).then(function(data){
                resolve(data.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getByGameActionId : function(game_action_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * from game_player_positions WHERE game_action_id = $1", [game_action_id]).then(function(data){
                resolve(data.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    deleteById : function(id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("DELETE FROM game_player_positions WHERE id = $1 RETURNING *;", [id]).then(function(data){
                resolve(data.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    }
}