var bluebird = require('bluebird');
var Promise = bluebird.Promise;

var DatabaseController = require("./../Controller/DatabaseController");

module.exports =  {

    //firstname, lastname, email
    create : function(username, password){
        return new Promise(function(resolve, reject){
            if(!username || !password){
                reject("Username and password parameters are required");
            }else{
                DatabaseController.query("INSERT INTO users (username, password, firstname, lastname, email) VALUES ($1, $2, $3, $4) RETURNING *", [username, password, firstname, lastname, email]).then(function(result){
                    resolve(result.rows[0]);
                }).catch(function(err){
                    reject(err);
                });
            }
        });
    },
    update : function(id, firstname, lastname, email){
        return new Promise(function(resolve, reject){
            DatabaseController.query("UPDATE users SET firstname=$2, lastname=$3, email=$4 WHERE id=$1 RETURNING *", [id, firstname, lastname, email]).then(function(data){
                resolve(data);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    updatePassword : function(id, password){
        return new Promise(function(resolve, reject){
            DatabaseController.query("UPDATE users SET password = $2 WHERE id=$1 RETURNING *", [id, password]).then(function(data){
                resolve(data);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    getAll : function(limit, offset){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * from users LIMIT $1 OFFSET $2", [limit || 1000, offset || 0]).then(function(data){
                resolve({limit: limit, offset: offset, users: data.rows});
            });
        });
    },
    getById : function(id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("SELECT * from users WHERE id = $1", [id]).then(function(data){
                resolve(data.rows);
            });
        });
    },
    deleteById : function(id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("DELETE FROM users WHERE id = $1 RETURNING *;", [id]).then(function(data){
                resolve({player: data.rows});
            }).catch(function(err){
                reject(err);
            });
        });
    }
}