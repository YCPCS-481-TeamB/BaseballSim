var Promise = require('bluebird').Promise;
var DatabaseController = require('./DatabaseController');
var TeamsController = require('./TeamsController');

var LineupModel = require('./../Models/Lineup');
var PlayerModel = require('./../Models/Player');
var TeamModel = require('./../Models/Team');

exports.setDefaultLineup = function(team_id, game_id){
    return new Promise(function(resolve, reject){

        LineupModel.create(team_id, game_id).then(function(lineup){
            TeamModel.getPlayers(team_id).then(function(players){
                var promises = [];

                var pitchers = players.filter(function(item){
                    return item.position == 'pitcher';
                });

                var startLineup = 0;

                if(pitchers.length > 0){
                    promises.push(LineupModel.setLineupPositon(lineup.id, pitchers[0].id, 0, true));
                }else{
                    promises.push(LineupModel.setLineupPositon(lineup.id, players[0].id, 0, true));
                    startLineup = 1;
                }

                for(var i = startLineup;i<9;i++){
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
                var promises = [];
                for (var i = 0; i < lineup_obj.players.length; i++) {
                    promises.push(LineupModel.setLineupPositon(lineup.id, lineup_obj.players[i], (i + 1)));
                }

                //id, player_id, lineup_index, is_pitcher
                promises.push(LineupModel.setLineupPositon(lineup.id, lineup_obj.pitcher, 0, true));
                Promise.all(promises).then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    reject(err);
                });
            }).catch(function (err) {
                reject(err);
            });
        }else{
            reject("ERROR IN JSON, should be in format: '{\"pitcher\": 10, \"players\": [1,2,3,4,5,6,7,8,9]}'");
        }
    });

}

exports.getNextLineupPlayerByGameAndTeamId = function(game_id, team_id){
    return new Promise(function(resolve, reject){
        LineupModel.getByGameAndTeamId(game_id, team_id).then(function(lineup){
            LineupModel.getNextLineupPlayerByLineupId(lineup.id).then(function(player){
                resolve(player);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getLineupPitcherByGameAndTeamId = function(game_id, team_id){
    return new Promise(function(resolve, reject){
        LineupModel.getByGameAndTeamId(game_id, team_id).then(function(lineup){
            LineupModel.getLineupPitcher(lineup.id).then(function(pitcher_lineup){
                PlayerModel.getById(pitcher_lineup.player_id).then(function(pitcher){
                    resolve(pitcher);
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