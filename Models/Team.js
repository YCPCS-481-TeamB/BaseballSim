var bluebird = require('bluebird');
var Promise = bluebird.Promise;

var DatabaseController = require("./../Controller/DatabaseController");

module.exports =  {
    create : function(team_name, league_id){
        return new Promise(function(resolve, reject){
            if(!team_name){
                reject("parameters are required");
            }else{
                DatabaseController.query("INSERT INTO teams (name,league_id) VALUES($1, $2) RETURNING *", [team_name, league_id]).then(function(result){
                    resolve(result.rows[0]);
                }).catch(function(err){
                    reject(err);
                });
            }
        });
    },
    update : function(id, obj){
        return new Promise(function(resolve, reject){
            DatabaseController.update('teams',id, obj).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
               reject(err);
            });
        });
    },
    getPlayers : function(team_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * FROM players WHERE team_id = $1", [team_id]).then(function(response){
                resolve(response.rows);
            });
        });
    },
    getAll : function(limit, offset){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * from teams LIMIT $1 OFFSET $2", [limit, offset]).then(function(data){
                resolve(data.rows);
            });
        });
    },
    getById : function(id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * from teams WHERE id = $1", [id]).then(function(data){
                resolve(data.rows);
            });
        });
    },
    getByUserId : function(user_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * from teams WHERE id in (SELECT item_id FROM permissions WHERE item_type='teams' AND user_id=$1)", [user_id]).then(function(data){
                resolve(data.rows);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getByGameAndUserId : function(game_id, user_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * from teams WHERE (id IN (SELECT team1_id FROM games WHERE id=$1) OR id IN (SELECT team2_id FROM games WHERE id=$1)) AND id in (SELECT item_id FROM permissions WHERE item_type='teams' AND user_id=$2)", [game_id, user_id]).then(function(data){
                resolve(data.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    deleteById : function(id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("DELETE FROM teams WHERE id = $1 RETURNING *;", [id]).then(function(data) {
                resolve(data.rows);
            }).catch(function (err) {
                reject(err);
            });
        });
    }
}