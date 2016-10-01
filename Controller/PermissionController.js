var DatabaseController = require('./DatabaseController');

exports.addPermission = function(item_type, item_id, user_id){
    return DatabaseController.query("INSERT INTO permissions (item_type, item_id, user_id) VALUES($1, $2, $3) RETURNING *;", [item_type, item_id, user_id]);
}
