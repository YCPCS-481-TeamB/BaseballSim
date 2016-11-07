var bluebird = require('bluebird');
var Promise = bluebird.Promise;

var DatabaseController = require("./../Controller/DatabaseController");

module.exports =  {
    /**
     * Creates a game in the database
     * @param team1_id
     * @param team2_id
     * @param field_id
     * @param league_id
     * @returns {bluebird.Promise} A Promise containing the created game
     */
    create : function(game_id, team_at_bat, type, message){
        return new Promise(function(resolve, reject){
            if(!game_id || !team_at_bat || !type || !message){
                reject("Missing a required parameter");
            }else{
                DatabaseController.query("INSERT INTO game_action (game_id, team_at_bat, type, message) VALUES ($1, $2, $3, $4) RETURNING *", [game_id, team_at_bat, type, message]).then(function(result){
                    resolve(result.rows[0]);
                }).catch(function(err){
                    reject(err);
                });
            }
        });
    },
    update : function(id, obj){
        return new Promise(function(resolve, reject){
            DatabaseController.update('game_action',id, obj).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    /**
     * Returns all game_actions in the database within the given limits
     * @param limit
     * @param offset
     * @returns {bluebird.Promise} A Promise containing all games
     */
    getAll : function(limit, offset){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * from game_action LIMIT $1 OFFSET $2", [limit | 1000, offset | 0]).then(function(result){
                resolve(result.rows);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    /**
     * Returns the game_action that has the given id
     * @param id
     * @returns {bluebird.Promise}
     */
    getById : function(id){
        return new Promise(function(resolve, reject){
            if(!id){
                reject("id is a required parameter");
            }else{
                DatabaseController.query("SELECT * from game_action WHERE id = $1", [id]).then(function(data){
                    resolve(data.rows[0]);
                }).catch(function(err){
                    reject(err);
                });
            }
        });
    },
    /**
     * Gets all game_actions that the given user_id has permission for
     * @param user_id
     * @returns {bluebird.Promise}
     */
    getAllByUserPermission : function(user_id){
        return new Promise(function(resolve, reject){
            if(!user_id){
                reject("user_id is a required parameter");
            }else{
                DatabaseController.query("SELECT * from game_action WHERE game_id in (SELECT item_id FROM permissions WHERE item_type='games' AND user_id=$1)", [user_id]).then(function(data){
                    resolve(data.rows);
                }).catch(function(err){
                    reject(err);
                });
            }
        });
    },
    getAllByGameId : function(game_id){
        return new Promise(function(resolve, reject){
            if(!game_id){
                reject("game_id is a required parameter");
            }else{
                DatabaseController.query("SELECT * FROM game_action WHERE game_id = $1", [game_id]).then(function(data){
                    resolve(data.rows);
                }).catch(function(err){
                    reject(err);
                });
            }
        });
    },
    getLatestByGameId : function(game_id){
        return new Promise(function(resolve, reject){
            if(!game_id){
                reject("game_id is a required parameter");
            }else{
                DatabaseController.query("SELECT * FROM game_action WHERE game_id=$1 ORDER BY date_created DESC LIMIT 1;", [game_id]).then(function(data){
                    resolve(data.rows[0]);
                }).catch(function(err){
                    reject(err);
                });
            }
        });
    },
    createFromPrevious : function(game_id, result, game_message){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * FROM game_action WHERE game_id=$1 ORDER BY date_created DESC LIMIT 1;", [game_id]).then(function(data){
                var event = data.rows[0];
                DatabaseController.query("INSERT INTO game_action (game_id, team_at_bat,team1_score,team2_score, balls, strikes, outs, type, message, inning)" +
                    "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *", [game_id, event.team_at_bat, event.team1_score, event.team2_score, event.balls, event.strikes, event.outs, result, game_message, event.inning]).then(function(result){
                    console.log(result.rows[0]);
                    resolve(result.rows[0]);
                }).catch(function(err){
                    reject(err);
                });
            }).catch(function(err){
                reject(err);
            });
        });
    },
    /**
     * Deletes the game with the given id
     * @param id
     * @returns {bluebird.Promise}
     */
    deleteById : function(id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("DELETE FROM game_action WHERE id = $1 RETURNING *;", [id]).then(function(data){
                resolve({game: data.rows});
            }).catch(function(err){
                reject(err);
            });
        });
    }
}