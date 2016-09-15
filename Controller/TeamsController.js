var DatabaseController = require('./DatabaseController');

exports.getTeams = function() {
	return new Promise(function(resolve, reject){
		DatabaseController.query("SELECT * from teams").then(function(data){
			resolve(data.rows);
		});
	});
}

exports.createTeam = function(team_name, league_id){
	return DatabaseController.query("INSERT INTO teams (name,league_id) VALUES($1, $2)", [team_name, league_id]);
}

exports.getTeamById = function(id){
	return new Promise(function(resolve, reject){
		DatabaseController.query("SELECT * from teams WHERE id = $1", [id]).then(function(data){
			resolve(data.rows);
		});
	});
}