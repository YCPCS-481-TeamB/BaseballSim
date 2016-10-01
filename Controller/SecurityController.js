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
                resolve(token);
            }else{
                reject("The Password Is Invalid");
            }
        }).catch(function(err){
            reject("Password Is Invalid");
        });
    });
}

exports.validateToken = function(token){
    return new Promise(function(resolve, reject){
        jwt.verify(token, 'Secret', function(err, decoded) {
            if(err) {
                reject(err);
            }else{
                resolve(decoded);
            }
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
