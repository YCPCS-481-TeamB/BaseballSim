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
    create : function(team1_id, team2_id, field_id, league_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("INSERT INTO games (team1_id, team2_id, field_id, league_id) VALUES ($1, $2, $3, $4) RETURNING *", [team1_id, team2_id, field_id | 0, league_id | 0]).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    /**
     * Updates the fields and league for game with the given id
     * @param id
     * @param field_id
     * @param league_id
     * @returns {bluebird.Promise}
     */
    update : function(id, field_id, league_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("UPDATE games SET field_id = $2, league_id = $3 WHERE id = $1 RETURNING *", [id, field_id, league_id]).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    /**
     * Returns all games in the database within the given limits
     * @param limit
     * @param offset
     * @returns {bluebird.Promise} A Promise containing all games
     */
    getAll : function(limit, offset){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * from games LIMIT $1 OFFSET $2", [limit | 1000, offset | 0]).then(function(result){
                resolve(result.rows);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    /**
     * Returns the gave that has the given id
     * @param id
     * @returns {bluebird.Promise}
     */
    getById : function(id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * from games WHERE id = $1", [id]).then(function(data){
                resolve(data.rows[0]);
            });
        });
    },
    /**
     * Gets all games that the given user_id has permission for
     * @param user_id
     * @returns {bluebird.Promise}
     */
    getAllByUserPermission : function(user_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * from games WHERE id in (SELECT item_id FROM permissions WHERE item_type='games' AND user_id=$1)", [user_id]).then(function(result){
                resolve(data.rows);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    hasEventWithType : function(id, type){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * from games WHERE id = $1 AND type = $2", [id, type]).then(function(data){
                resolve(result.rows.length != 0);
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
            DatabaseController.query("DELETE FROM games WHERE id = $1 RETURNING *;", [id]).then(function(data){
                resolve({game: data.rows});
            }).catch(function(err){
                reject(err);
            });
        });
    }
}