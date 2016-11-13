var bluebird = require('bluebird');
var Promise = bluebird.Promise;

var DatabaseController = require("./../Controller/DatabaseController");

var PlayerModel = require('./../Models/Player');

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
    //TODO: Implement
    update : function(){
        return new Promise(function(resolve, reject){
            reject("NOT IMPLEMENTED");
        });
    },
    setLineupPositon : function(id, player_id, lineup_index){
        return new Promise(function(resolve, reject){
            DatabaseController.query("INSERT INTO lineup_items (lineup_id, player_id, lineup_index) VALUES ($1, $2, $3) RETURNING *", [id, player_id, lineup_index]).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getAll : function(limit, offset){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * FROM lineups LIMIT $1 OFFSET $2", [limit, offset]).then(function(result){
                resolve(result.rows);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getById : function(id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * FROM lineup_items WHERE lineup_id=$1 ORDER BY lineup_index ASC;", [lineup_id]).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getByGameAndTeamId : function(game_id, team_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * FROM lineups WHERE game_id = $1 AND team_id = $2",[game_id, team_id]).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getLineupPlayersById : function(lineup_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * FROM lineup_items WHERE lineup_id IN (SELECT id FROM lineups WHERE id = $1) ORDER BY lineup_index ASC",[lineup_id]).then(function(result){
                resolve(result.rows);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getByGameAndUserId : function(game_id, user_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * FROM lineups WHERE game_id=$1 AND team_id IN (SELECT id FROM teams WHERE id IN (SELECT item_id FROM permissions WHERE user_id=$2 AND item_type='teams'))", [game_id, user_id]).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    setAlreadyPlayedStatusByLineupId : function(lineup_id, status){
        return new Promise(function(resolve, reject){
           DatabaseController.query("UPDATE lineup_items SET already_played=$2 WHERE lineup_id = $1", [lineup_id,status]).then(function(result){
               resolve(result.rows);
           }).catch(function(err){
               reject(err);
           });
        });
    },
    getNextLineupPlayerByLineupId : function(lineup_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * FROM players WHERE id IN (SELECT player_id FROM lineup_items WHERE lineup_id in (SELECT id FROM lineups WHERE id = $1) AND already_played != true ORDER BY lineup_index ASC LIMIT 1)",[lineup_id]).then(function(result){
                if(result.rows.length <= 0){
                    DatabaseController.query("UPDATE lineup_items SET already_played=$2 WHERE lineup_id = $1 RETURNING *", [lineup_id,false]).then(function(result){
                        PlayerModel.getById(result.rows[0].player_id).then(function(player){
                            resolve(player);
                        }).catch(function(err){
                            reject(err);
                        });
                    }).catch(function(err){
                        reject(err);
                    });
                }else{
                    resolve(result.rows[0]);
                }
            }).catch(function(err){
                reject(err);
            });
        });
    },
    markLastPlayerAsPlayed : function(game_id, player_id, team_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("UPDATE lineup_items SET already_played = true WHERE (player_id = $1 AND lineup_id IN (SELECT id FROM lineups WHERE game_id=$2 AND team_id=$3)) RETURNING *", [player_id, game_id, team_id]).then(function(data){
                resolve(data.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    deleteById : function(id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("DELETE lineup_items WHERE lineup_id=$1 ORDER BY lineup_index ASC;", [lineup_id]).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    }
}