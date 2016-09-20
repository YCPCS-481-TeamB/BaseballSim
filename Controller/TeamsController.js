var bluebird = require('bluebird');
var DatabaseController = require('./DatabaseController');
var PlayerController = require('./PlayersController');

const TEAM_SIZE = 25;

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

exports.buildRandomTeam = function(team_name, league_id){
	return new Promise(function(resolve, reject){
		DatabaseController.query("INSERT INTO teams (name,league_id) VALUES($1, $2) RETURNING *", [team_name, league_id]).then(function(response){
			var players = [];
			for(var i = 0;i<TEAM_SIZE;i++){
				players.push(PlayerController.createRandomPlayer(response.rows[0].id));
			}
			Promise.all(players).then(function(data){
				var object = response.rows[0];
				object.players = data.map(function(item){return item.rows[0]});
				resolve(object);
			});
		});
	});
}

exports.getPlayersByTeamId = function(team_id){
	return new Promise(function(resolve, reject){
		DatabaseController.query("SELECT * FROM players WHERE team_id = $1", [team_id]).then(function(response){
			resolve(response.rows);
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

exports.deleteTeamById = function(id) {
	return new Promise(function(resolve, reject){
		DatabaseController.query("DELETE FROM teams WHERE id = $1 RETURNING *;", [id]).then(function(data) {
			resolve({team: data.rows});
		}).catch(function (err) {
			reject(err);
		});
	});
}