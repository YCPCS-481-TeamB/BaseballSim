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
		DatabaseController.query("SELECT * from league WHERE id = $1", [id]).then(function(data){
			resolve(data.rows);
		});
	});
}