var DatabaseController = require('./DatabaseController');


exports.createPlayer = function(firstname, lastname, position, team_id){
    return DatabaseController.query("INSERT INTO players (firstname,lastname,position,team_id) VALUES($1, $2, $3, $4)", [firstname, lastname, position, team_id]);
}

exports.createRandomPlayer = function(firstname, lastname, position, team_id){
    return DatabaseController.query("INSERT INTO players (firstname,lastname,position,team_id) VALUES($1, $2, $3, $4)", [firstname, lastname, position, team_id]);
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
