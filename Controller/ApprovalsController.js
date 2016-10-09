var DatabaseController = require('./DatabaseController');

exports.createApproval = function(item_type, item_id, user_id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("INSERT INTO approvals (item_type, item_id, approver_user_id) VALUES ($1, $2, $3) RETURNING *", [item_type, item_id, user_id]).then(function(data){
            resolve(data.rows[0]);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getApprovals= function(limit, offset){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * FROM approvals OFFSET $1 LIMIT $2", [limit, offset]).then(function(data){
            resolve(data.rows);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getApprovalByItemTypeAndId = function(item_type, item_id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * FROM approvals WHERE item_type = $1 AND item_id = $2", [item_type, item_id]).then(function(data){
            resolve(data.rows);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getApprovalByUserId = function(user_id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * FROM approvals WHERE approver_user_id = $1", [user_id]).then(function(data){
            resolve(data.rows);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getApprovalByUserIdAndStatus = function(user_id, status){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * FROM approvals WHERE approver_user_id = $1 AND approved=$2", [user_id, status]).then(function(data){
            resolve(data.rows);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getApprovalById = function(id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * FROM approvals WHERE id = $1", [id]).then(function(data){
            resolve(data.rows);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.setApprovalStatus = function(id, status){
    return new Promise(function(resolve, reject){
        console.log("UPDATE approvals SET approved="+status+" WHERE id = "+ id +" RETURNING *");
        DatabaseController.query("UPDATE approvals SET approved=$2 WHERE id = $1 RETURNING *", [id, status]).then(function(data){
            resolve(data.rows);
        }).catch(function(err){
            reject(err);
        });
    });
}