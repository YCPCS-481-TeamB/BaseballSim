var DatabaseController = require('./DatabaseController');

/**
 * Creates the player with the given parameters
 * @param firstname
 * @param lastname
 * @param position
 * @param team_id
 * @Returning Promise.<Object> Returns a promise containing the returned player data
 */
exports.createPlayer = function(firstname, lastname, position, team_id){
    return DatabaseController.query("INSERT INTO players (firstname,lastname,position,team_id) VALUES($1, $2, $3, $4)", [firstname, lastname, position, team_id]);
}

/**
 * Creates a randomised player with random first and last name from the database
 * @param team_id
 * @returns {Promise}
 */
exports.createRandomPlayer = function(team_id){
    var team_id = team_id || 0;
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT name FROM player_names WHERE isLast = 'n' OFFSET floor(random()*(SELECT COUNT(name) FROM player_names WHERE isLast = 'n')) LIMIT 1").then(function(firstname_data){
            var firstname = firstname_data.rows[0].name;
            DatabaseController.query("SELECT name FROM player_names WHERE isLast = 'y' OFFSET floor(random()*(SELECT COUNT(name) FROM player_names WHERE isLast = 'y')) LIMIT 1").then(function(lastname_data){
                var lastname = lastname_data.rows[0].name;
                resolve(DatabaseController.query("INSERT INTO players (firstname,lastname,position,team_id) VALUES($1, $2, $3, $4) RETURNING *", [firstname, lastname, 'pitcher', team_id]));
            });
        }).catch(function(err){
            reject("" + err);
        });
    });
}

function createRandomAttr(player_id){

}

/**
 * Deletes the player from the database
 * @param id
 */
exports.deletePlayersById = function(id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("DELETE FROM players WHERE id = $1 RETURNING *;", [id]).then(function(data){
            resolve({player: data.rows});
        }).catch(function(err){
            reject(err);
        });
    });
}

/**
 * Returns a Promise of an array of players based on the limit and offset
 * @param limit
 * @param offset
 * @returns {Promise}
 */
exports.getPlayers = function(limit, offset) {
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * from players LIMIT $1 OFFSET $2", [limit || 1000, offset || 0]).then(function(data){
            resolve({limit: limit, offset: offset, players: data.rows});
        });
    });
}

/**
 * Returns a promise that contains an array of the players with the requested id
 * @param id
 * @returns {Promise}
 */
exports.getPlayersById = function(id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * from players WHERE id = $1", [id]).then(function(data){
            resolve(data.rows);
        });
    });
}
