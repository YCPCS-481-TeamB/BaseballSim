//var DatabaseController = require('./DatabaseController');
var ApprovalModel = require('./../Models/Approval');
var GameActionModel = require('./../Models/GameAction');
var PermissionModel = require('./../Models/Permission');

exports.createGameApprovalByLastGameAction = function(game_action_id){
    return new Promise(function(resolve, reject){
        GameActionModel.getById(game_action_id).then(function(game_action){
            PermissionModel.getOwnerForItem('teams', game_action.team_at_bat).then(function(user_id){
                ApprovalModel.create('games', game_action.game_id, user_id).then(function(approval){
                    ApprovalModel.update(approval.id, {auto_approved : true}).then(function(approval){
                        resolve(approval);
                    }).catch(function(err){
                        reject(err);
                    });
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

exports.hasNoOutstandingApprovals = function(item_type, item_id){
    return new Promise(function(resolve, reject){
        ApprovalModel.checkApprovalStatusByItemAndId(item_type, item_id).then(function(approvals){
            resolve(approvals);
        }).catch(function(err){
            reject(err);
        });
    });
}