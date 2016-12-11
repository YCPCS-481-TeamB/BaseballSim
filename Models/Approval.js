var bluebird = require('bluebird');
var Promise = bluebird.Promise;

var DatabaseController = require("./../Controller/DatabaseController");

module.exports =  {
    create : function(item_type, item_id, user_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("INSERT INTO approvals (item_type, item_id, approver_user_id) VALUES ($1, $2, $3) RETURNING *", [item_type, item_id, user_id]).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    updateStatus : function(id, status){
        return new Promise(function(resolve, reject){
            DatabaseController.query("UPDATE approvals SET approved=$2 WHERE id = $1 RETURNING *", [id, status]).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    update : function(id, obj){
        return new Promise(function(resolve, reject){
            DatabaseController.update('approvals',id, obj).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getAll : function(limit, offset){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * from approvals LIMIT $1 OFFSET $2", [limit | 1000, offset | 0]).then(function(result){
                resolve(result.rows);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getById : function(id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * FROM approvals WHERE id = $1", [id]).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getAllByUserId : function(user_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * FROM approvals WHERE approver_user_id = $1", [user_id]).then(function(result){
                resolve(result.rows);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getAllByUserIdAndStatus : function(user_id, status){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * FROM approvals WHERE approver_user_id = $1 AND approved=$2", [user_id, status]).then(function(result){
                resolve(result.rows);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getAllByTypeAndItemId : function(item_type, item_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * FROM approvals WHERE item_type = $1 AND item_id = $2", [item_type, item_id]).then(function(result){
                resolve(result.rows);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    checkApprovalStatusByItemAndId : function(item_type, item_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * FROM approvals WHERE item_type = $1 AND item_id = $2 AND approved != 'approved'", [item_type, item_id]).then(function(result){
                resolve(result.rows.length == 0);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    deleteById : function(id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * FROM approvals WHERE id = $1", [id]).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    }
}