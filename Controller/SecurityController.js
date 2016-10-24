var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var DatabaseController = require('./DatabaseController');

exports.createSecureUser = function(username, password){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT username FROM users WHERE username = $1", [username]).then(function(data){
            if(data.rowCount == 0){
                hashPassword(password).then(function(password_hash){
                    DatabaseController.query("INSERT INTO users (username, password) VALUES($1, $2) RETURNING id, username, firstname, lastname, email, date_created", [username, password_hash]).then(function(user){
                        resolve(user);
                    }).catch(function(err){
                        reject(err);
                    });
                }).catch(function(err){
                    reject(err);
                });
            }else{
                reject("Username is taken");
            }
        }).catch(function(err){
            reject(err);
        });
    });
}

hashPassword = function(password){
    return new Promise(function(resolve, reject){
        bcrypt.genSalt(10, function(err, salt){
            if(err){
                reject(err);
            }else{
                bcrypt.hash(password, salt, function(err, hash){
                    if(err){
                        reject(err);
                    }else{
                        resolve(hash);
                    }
                });
            }
        });
    });
}

checkHash = function(password, hashed_password){
    return new Promise(function(resolve, reject){
        bcrypt.compare(password, hashed_password, function(err, res){
            if(err){
                reject(err);
            }else {
                resolve(res);
            }
        });
    });
}

exports.getToken = function(username, password){
    return new Promise(function(resolve, reject){
        validatePassword(username, password).then(function(data){
            if(data.isValidHash == true){
                var token = jwt.sign(data.user, 'Secret');
                addTokenToDatabase(data.user.id, token).then(function(data2){
                    resolve(token);
                }).catch(function(err){
                    reject(err);
                });
            }else{
                reject("The Password Is Invalid");
            }
        }).catch(function(err){
            reject("Password Is Invalid");
        });
    });
}

checkTokenInDatabase = function(token){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * FROM user_tokens WHERE token = $1", [token]).then(function(tokens){
            //console.log(tokens.rows);
            if(tokens.rows.length == 0){
                reject("Token Not Recognised!");
            }else{
                resolve(tokens.rows[0]);
            }
        }).catch(function(err){
            reject(err);
        });
    });
}

addTokenToDatabase = function(user_id, token){
    return new Promise(function(resolve, reject){
        DatabaseController.query("INSERT INTO user_tokens (user_id, token) VALUES ($1, $2) RETURNING *", [user_id, token]).then(function(data){
            resolve(data.rows[0]);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.validateToken = function(token){
    return new Promise(function(resolve, reject){
        checkTokenInDatabase(token).then(function(token2){
            jwt.verify(token, 'Secret', function(err, decoded) {
                if(err) {
                    reject(err);
                }else{
                    resolve(decoded);
                }
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

validatePassword = function(username, password){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * FROM users WHERE username=$1", [username]).then(function(data){
            if(data.rowCount > 0){
                var password_hash = data.rows[0].password;
                checkHash(password, password_hash).then(function(isValidHash){
                    resolve({user: data.rows[0], isValidHash:isValidHash});
                });
            }else{
                reject("User Not Found");
            }
        }).catch(function(err){
            reject(err);
        });
    });
}
