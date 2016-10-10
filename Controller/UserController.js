var DatabaseController = require('./DatabaseController');
var SecurityController = require('./SecurityController');

/**
 * Deletes the user from the database
 * @param id
 */
exports.deleteUserById = function(id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("DELETE FROM users WHERE id = $1 RETURNING *;", [id]).then(function(data){
            resolve({player: data.rows});
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.updateUser = function(id, firstname, lastname, email){
    return new Promise(function(resolve, reject){
        DatabaseController.query("UPDATE users SET firstname=$2, lastname=$3, email=$4 WHERE id=$1 RETURNING *", [id, firstname, lastname, email]).then(function(data){
            resolve(data);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.createUser = function(username, password, firstname, lastname, email){
    return new Promise(function(resolve, reject){
        if(username && password){
            SecurityController.createSecureUser(username, password).then(function(data){
                exports.updateUser(data.rows[0].id, firstname, lastname, email).then(function(data2){
                    resolve(data2);
                }).catch(function(err){
                    reject(err);
                });

            }).catch(function(err){
                reject(err);
            });
        }
    });
}

/**
 * Returns a Promise of an array of users based on the limit and offset
 * @param limit
 * @param offset
 * @returns {Promise}
 */
exports.getUsers = function(limit, offset) {
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * from users LIMIT $1 OFFSET $2", [limit || 1000, offset || 0]).then(function(data){
            resolve({limit: limit, offset: offset, users: data.rows});
        });
    });
}

/**
 * Returns a promise that contains an array of the users with the requested id
 * @param id
 * @returns {Promise}
 */
exports.getUserById = function(id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * from users WHERE id = $1", [id]).then(function(data){
            resolve(data.rows);
        });
    });
}
