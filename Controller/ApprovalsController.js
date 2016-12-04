//var DatabaseController = require('./DatabaseController');
var ApprovalModel = require('./../Models/Approval');
var GameActionModel = require('./../Models/GameAction');
var PermissionModel = require('./../Models/Permission');



exports.createGameApprovalByLastGameAction = function(game_action_id){
    return new Promise(function(resolve, reject){
        GameActionModel.getById(game_action_id).then(function(game_action){
            PermissionModel.getOwnerForItem('teams', game_action.team_at_bat).then(function(user_id){
                ApprovalModel.create('games', game_action.game_id, user_id).then(function(approval){
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

//exports.createApproval = function(item_type, item_id, user_id){
//    return new Promise(function(resolve, reject){
//        DatabaseController.query("INSERT INTO approvals (item_type, item_id, approver_user_id) VALUES ($1, $2, $3) RETURNING *", [item_type, item_id, user_id]).then(function(data){
//            resolve(data.rows[0]);
//        }).catch(function(err){
//            reject(err);
//        });
//    });
//}
//
//exports.getApprovals= function(limit, offset){
//    return new Promise(function(resolve, reject){
//        DatabaseController.query("SELECT * FROM approvals OFFSET $1 LIMIT $2", [limit, offset]).then(function(data){
//            resolve(data.rows);
//        }).catch(function(err){
//            reject(err);
//        });
//    });
//}
//
//exports.getApprovalByItemTypeAndId = function(item_type, item_id){
//    return new Promise(function(resolve, reject){
//        DatabaseController.query("SELECT * FROM approvals WHERE item_type = $1 AND item_id = $2", [item_type, item_id]).then(function(data){
//            resolve(data.rows);
//        }).catch(function(err){
//            reject(err);
//        });
//    });
//}
//
//exports.getApprovalByUserId = function(user_id){
//    return new Promise(function(resolve, reject){
//        DatabaseController.query("SELECT * FROM approvals WHERE approver_user_id = $1", [user_id]).then(function(data){
//            resolve(data.rows);
//        }).catch(function(err){
//            reject(err);
//        });
//    });
//}
//
//exports.getApprovalByUserIdAndStatus = function(user_id, status){
//    return new Promise(function(resolve, reject){
//        DatabaseController.query("SELECT * FROM approvals WHERE approver_user_id = $1 AND approved=$2", [user_id, status]).then(function(data){
//            resolve(data.rows);
//        }).catch(function(err){
//            reject(err);
//        });
//    });
//}
//
//exports.getApprovalById = function(id){
//    return new Promise(function(resolve, reject){
//        DatabaseController.query("SELECT * FROM approvals WHERE id = $1", [id]).then(function(data){
//            resolve(data.rows);
//        }).catch(function(err){
//            reject(err);
//        });
//    });
//}
//
//exports.setApprovalStatus = function(id, status){
//    return new Promise(function(resolve, reject){
//        DatabaseController.query("UPDATE approvals SET approved=$2 WHERE id = $1 RETURNING *", [id, status]).then(function(data){
//            resolve(data.rows);
//        }).catch(function(err){
//            reject(err);
//        });
//    });
//}