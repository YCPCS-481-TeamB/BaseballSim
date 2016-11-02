var bluebird = require('bluebird');
var Promise = bluebird.Promise;

var DatabaseController = require("./../Controller/DatabaseController");

module.exports =  {
    create : function(user_id, item_id, item_type){
        return new Promise(function(resolve, reject){
            DatabaseController.query("INSERT INTO permissions (user_id, item_id, item_type) VALUES ($1, $2, $3) RETURNING *", [user_id, item_id, item_type]).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    update : function(id, type){
        return new Promise(function(resolve, reject){
            DatabaseController.query("UPDATE permissions SET type=$2 WHERE id=$1 RETURNING *", [id, type]).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getAll : function(limit, offset){
        return new Promise(function(resolve, reject){
            throw "getAll function in permissions is not finished";
        });
    },
    getOwnerForItem : function(item_type, item_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT user_id FROM permissions WHERE item_type=$1 AND item_id=$2", [item_type, item_id]).then(function(result){
                resolve(result.rows[0].user_id);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getById : function(id){
        return new Promise(function(resolve, reject){
            throw "getById function is not finished in permissions";
        });
    },
    deleteById : function(id){
        return new Promise(function(resolve, reject){
            throw "deleteById is not implemented for permissions yet";
        });
    }
}