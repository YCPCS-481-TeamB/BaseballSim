var DatabaseController = require('./DatabaseController');


exports.createPlayer = function(firstname, lastname, position, team_id){
    return DatabaseController.query("INSERT INTO players (firstname,lastname,position,team_id) VALUES($1, $2, $3, $4)", [firstname, lastname, position, team_id]);
}

exports.createRandomPlayer = function(team_id){
    var team_id = team_id || 0;
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT name FROM player_names WHERE isLast = 'n' OFFSET floor(random()*4) LIMIT 1").then(function(firstname_data){
            var firstname = firstname_data.rows[0].name;
            DatabaseController.query("SELECT name FROM player_names WHERE isLast = 'y' OFFSET floor(random()*4) LIMIT 1").then(function(lastname_data){
                var lastname = lastname_data.rows[0].name;
                resolve(DatabaseController.query("INSERT INTO players (firstname,lastname,position,team_id) VALUES($1, $2, $3, $4) RETURNING *", [firstname, lastname, 'pitcher', team_id]));
            });
        });
    });
}

exports.deletePlayer = function(id){

}

exports.getPlayers = function() {
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * from players").then(function(data){
            resolve(data.rows);
        });
    });
}

exports.getPlayersById = function(id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * from players WHERE id = $1", [id]).then(function(data){
            resolve(data.rows);
        });
    });
}
