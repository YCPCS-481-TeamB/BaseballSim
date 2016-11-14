var Promise = require('bluebird').Promise;
var DatabaseController = require('./DatabaseController');
var TeamsController = require('./TeamsController');

var LineupModel = require('./../Models/Lineup');
var TeamModel = require('./../Models/Team');

exports.setDefaultLineup = function(team_id, game_id){
    return new Promise(function(resolve, reject){

        LineupModel.create(team_id, game_id).then(function(lineup){
            TeamModel.getPlayers(team_id).then(function(players){
                var promises = [];
                for(var i = 0;i<players.length;i++){
                    promises.push(LineupModel.setLineupPositon(lineup.id, players[i].id, (i+1)));
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

exports.createNewLineupByGameAndTeamId = function(game_id, team_id, lineup_obj){
    //{pitcher: 10, players: [1,2,3,4,5,6,7,8,9]}
    return new Promise(function(resolve, reject){
        if(lineup_obj && lineup_obj.pitcher && lineup_obj.players) {
            LineupModel.create(team_id, game_id).then(function (lineup) {
                console.log("LINEUP", lineup);
                console.log(lineup)
                var promises = [];
                for (var i = 0; i < lineup_obj.players.length; i++) {
                    console.log("PROMISED");
                    promises.push(LineupModel.setLineupPositon(lineup.id, lineup_obj.players[i], (i + 1)));
                }
                promises.push(LineupModel.setLineupPositon(lineup.id, lineup.pitcher, 10));
                Promise.all(promises).then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    reject(err);
                });
            }).catch(function (err) {
                reject(err);
            });
        }else{
            reject("ERROR IN JSON, should be in format: '{pitcher: 10, players: [1,2,3,4,5,6,7,8,9]}'");
        }
    });

}

exports.getNextLineupPlayerByGameAndTeamId = function(game_id, team_id){
    return new Promise(function(resolve, reject){
        LineupModel.getByGameAndTeamId(game_id, team_id).then(function(lineup){
            LineupModel.getNextLineupPlayerByLineupId(lineup.id).then(function(player){
                //console.log("LINEUP PLAYER: ", player);
                resolve(player);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

//exports.getLineupByGameAndTeamId = function(game_id, team_id){
//    return new Promise(function(resolve, reject){
//        DatabaseController.query("SELECT * FROM lineup_items WHERE lineup_id in (SELECT id FROM lineups WHERE game_id=$1 AND team_id=$2) ORDER BY lineup_index ASC",[game_id, team_id]).then(function(result){
//            resolve(result.rows);
//        }).catch(function(err){
//            reject(err);
//        });
//    });
//}

//exports.getLineupByGameAndUserId = function(game_id, team_id){
//    return new Promise(function(resolve, reject){
//        DatabaseController.query("SELECT * FROM lineup_items WHERE lineup_id in (SELECT id FROM lineups WHERE game_id=$1 AND team_id IN (SELECT id FROM teams WHERE id in (SELECT item_id FROM permissions WHERE item_type='teams' AND user_id=$2))) ORDER BY lineup_index ASC",[game_id, user_id]).then(function(result){
//            resolve(result.rows);
//        }).catch(function(err){
//            reject(err);
//        });
//    });
//}

//exports.createLineup = function(team_id, game_id){
//    return new Promise(function(resolve, reject){
//        DatabaseController.query("INSERT INTO lineups (team_id, game_id) VALUES ($1, $2) RETURNING *", [team_id, game_id]).then(function(result){
//            resolve(result.rows[0]);
//        }).catch(function(err){
//            reject(err);
//        });
//    });
//}

//exports.getLineupById = function(lineup_id){
//    return new Promise(function(resolve, reject){
//        DatabaseController.query("SELECT * FROM lineup_items WHERE lineup_id=$1 ORDER BY lineup_index ASC;", [lineup_id]).then(function(result){
//            resolve(result.rows);
//        }).catch(function(err){
//            reject(err);
//        });
//    });
//}

//exports.setLineupPosition = function(lineup_id, player_id, lineup_index){
//    return new Promise(function(resolve, reject){
//        DatabaseController.query("INSERT INTO lineup_items (lineup_id, player_id, lineup_index) VALUES ($1, $2, $3) RETURNING *", [lineup_id, player_id, lineup_index]).then(function(result){
//            resolve(result.rows[0]);
//        }).catch(function(err){
//            reject(err);
//        });
//    });
//}