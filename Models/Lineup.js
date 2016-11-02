var bluebird = require('bluebird');
var Promise = bluebird.Promise;

var DatabaseController = require("./../Controller/DatabaseController");

module.exports = {
    create : function(team_id, game_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("INSERT INTO lineups (team_id,game_id) VALUES ($1, $2) RETURNING *", [team_id, game_id]).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    update : function(){
        return new Promise(function(resolve, reject){

        });
    },
    setLineupPositon : function(id, player_id, lineup_index){
        return new Promise(function(resolve, reject){
            DatabaseController.query("INSERT INTO lineup_items (lineup_id, player_id, lineup_index) VALUES ($1, $2, $3) RETURNING *", [lineup_id, player_id, lineup_index]).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getAll : function(limit, offset){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * FROM lineups LIMIT $1 OFFSET $2", [limit, offset]).then(function(result){

            }).catch(function(err){

            });
        });
    },
    getById : function(id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * FROM lineup_items WHERE lineup_id=$1 ORDER BY lineup_index ASC;", [lineup_id]).then(function(result){
                resolve(result.rows);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getByGameAndTeamId : function(game_id, team_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * FROM lineups WHERE game_id = $1 AND team_id = $2",[game_id, team_id]).then(function(result){
                resolve(result.rows);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getLineupPlayersById : function(lineup_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * FROM lineup_items WHERE lineup_id in (SELECT id FROM lineups WHERE id = $1) ORDER BY lineup_index ASC",[lineup_id]).then(function(result){
                resolve(result.rows);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    deleteById : function(id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("DELETE lineup_items WHERE lineup_id=$1 ORDER BY lineup_index ASC;", [lineup_id]).then(function(result){
                resolve(result.rows);
            }).catch(function(err){
                reject(err);
            });
        });
    }
}