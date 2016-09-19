var DatabaseController = require('./DatabaseController');

exports.getLeagues = function() {
	return new Promise(function(resolve, reject){
		DatabaseController.query("SELECT * from leagues").then(function(data){
			resolve(data.rows);
		});
	});
}

exports.getLeagueById = function(id){
	return new Promise(function(resolve, reject){
		DatabaseController.query("SELECT * from leagues WHERE id = $1", [id]).then(function(data){
			resolve(data.rows);
		});
	});
}

exports.createLeague = function(league_name, league_id) {
	return DatabaseController.query("INSERT INTO leagues (name, league_id) VALUES($1, $2)", [league_name, league_id]);
}

exports.deleteLeagueById = function(id) {
	return new Promise(function(resolve, reject){
		DatabaseController.query("DELETE FROM leagues WHERE id = $1 RETURNING *;", [id]).then(function(data) {
			resolve({league: data.rows});
		}).catch(function (err) {
			reject(err);
		});
	}
}