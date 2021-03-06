var PermissionModel = require('./../Models/Permission');
var DatabaseController = require('./DatabaseController');

//exports.addPermission = function(item_type, item_id, user_id){
//    return DatabaseController.query("INSERT INTO permissions (item_type, item_id, user_id) VALUES($1, $2, $3) RETURNING *;", [item_type, item_id, user_id]);
//}
//
//exports.getOwnerForItem = function(item_type, item_id){
//    return DatabaseController.query("SELECT user_id FROM permissions WHERE item_type=$1 AND item_id=$2", [item_type, item_id]);
//}

exports.executeIfPermissionAcceptable = function(userdata, item_type, item_id){
    return new Promise(function(resolve, reject){
        PermissionModel.checkPermission(userdata.id, item_type, item_id).then(function(isAllowed){
            resolve(isAllowed);
        }).catch(function(err){
            reject(err);
        });
    });
}
