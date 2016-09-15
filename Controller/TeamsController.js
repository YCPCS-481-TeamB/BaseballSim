var DatabaseController = require('./DatabaseController');

exports.getTeams = function() {
	return new Promise(function(resolve, reject){
		DatabaseController.query("SELECT * from teams").then(function(data){
			resolve(data.rows);
		});
	});
}

exports.getTeamById = function(id){
	return new Promise(function(resolve, reject){
		DatabaseController.query("SELECT * from teams WHERE id = $1", [id]).then(function(data){
			resolve(data.rows);
		});
	});
}