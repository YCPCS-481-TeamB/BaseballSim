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
                DatabaseController.query("INSERT INTO players (firstname,lastname,position,team_id) VALUES($1, $2, $3, $4) RETURNING *", [firstname, lastname, assignPlayerPosition(), team_id]).then(function(player){
                    var player = player.rows[0];
                    createRandomAttr(player.id, player.position).then(function(attr){
                        createPlayerStats(player.id).then(function(stats) {
                            resolve(player);
                        }).catch(function(err){
                            reject(err);
                        });
                    })
                });
            });
        }).catch(function(err){
            reject("" + err);
        });
    });
}

/**
 * @params void
 * @returns string of player position
 */

function assignPlayerPosition() {
    var num = Math.floor(Math.random() * 7);
    var positionStringArray = ['pitcher', 'catcher', 'first_baseman', 'second_baseman', 'third_baseman','shortstop', 'left_fielder', 'center_fielder', 'right_fielder'];
    return positionStringArray[num];
}

/**
 *
 * @param player_id
 * @returns {Promise}
 */
exports.getPlayerAttributesById = function(player_id){
    var team_id = team_id || 0;
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * FROM attributes WHERE player_id = $1", [player_id]).then(function(attrs){
            resolve(attrs.rows[0]);
        }).catch(function(err){
            reject("" + err);
        });
    });
}

function createRandomAttr(player_id, player_position){
    return new Promise(function(resolve, reject) {
        // Total Points: 50, Use 11 to give each stat 1
        var points = 39;
        var totalAttributes = {technique: 1, pitch_speed: 1, endurance: 1, contact: 1, swing_speed: 1, bat_power: 1, catching: 1, throwing: 1, awareness: 1, speed: 1, clutch: 1};
        // Giving Batters no Pitching Stats, Giving Pitchers no Batting Stats
        var batterAttributes = {contact: 1, swing_speed: 1, bat_power: 1, catching: 1, throwing: 1, awareness: 1, speed: 1, clutch: 1};
        var pitcherAttributes = {technique: 1, pitch_speed: 1, endurance: 1, catching: 1, throwing: 1, awareness: 1, speed: 1, clutch: 1};
        // Determine Dominant Arm, Right-Handed favored
        var arm = 'right';
        var rngArm = Math.floor(Math.random() * 3);
        if (rngArm == 2) {
            arm = 'left';
        }
        while (points > 0) {
            // Player is a Pitcher
            if (player_position == 'pitcher') {
                var rngPitcher = Math.floor(Math.random() * 11);
                if (rngPitcher >= 3 && rngPitcher <=5) {
                    rngPitcher = Math.floor(Math.random() * 11);
                }
                totalAttributes[Object.keys(totalAttributes)[rngPitcher]] += 1;

            }
            // Player is a Batter
            else {
                var rngBatter = Math.floor(Math.random() * 11);
                if (rngBatter <= 2) {
                    rngBatter = Math.floor(Math.random() * 11);
                }
                totalAttributes[Object.keys(totalAttributes)[rngBatter]] += 1;

            }
            points--;
        }

        DatabaseController.query("INSERT INTO attributes (player_id, technique, pitch_speed, endurance, contact, swing_speed, bat_power, catching, throwing, awareness, speed, clutch, arm)" +
            "VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *", [player_id, totalAttributes.technique, totalAttributes.pitch_speed, totalAttributes.endurance,
            totalAttributes.contact, totalAttributes.swing_speed, totalAttributes.bat_power, totalAttributes.catching, totalAttributes.throwing, totalAttributes.awareness,
            totalAttributes.speed, totalAttributes.clutch, arm]).then(function(attrs){
                resolve(attrs);
            }).catch(function(err){
                reject("" + err);
        });
    });
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
 * Deletes the player from the database
 * @param team_id
 */
exports.deletePlayerByTeamId = function(team_id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("DELETE FROM players WHERE team_id = $1 RETURNING *;", [team_id]).then(function(data){
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
 * @param id - The players id
 * @returns {Promise}
 */
exports.getPlayersById = function(id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * from players WHERE id = $1", [id]).then(function(data){
            if(data.rows[0]){
                resolve(data.rows[0]);
            }else{
                reject("Player " + id + " not found");
            }

        });
    });
}

/**
 * Returns a Promise of an array of players with the requested team id
 * @param team_id
 * @returns {Promise}
 */
exports.getPlayersByTeamId = function(team_id) {
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * from players WHERE team_id = $1", [team_id]).then(function(data){
            if(data.rows){
                resolve(data.rows);
            }
        });
    });
}

/**
 * Returns a promise that contains an array of player's stats with the requested id
 * @param id - the players id
 * @returns {Promise}
 */
exports.getStatsByPlayerId = function(id){
    return new Promise(function(resolve, reject) {
            DatabaseController.query("SELECT * from stats WHERE player_id = $1", [id]).then(function(data) {
                if (data.rows[0]) {
                    resolve(data.rows[0]);
                }
                else {
                    reject("Player " + id + " not found");
                }
            }).catch(function(err){
                reject(err);
            });
    });
}

/**
 * Returns a promise that returns the stats for the new player
 * @param id
 * @returns {Promise}
 */
createPlayerStats = function(id) {
    return new Promise(function(resolve, reject) {
        var statsMap = {hits: 0, doubles:0, games_played: 0, at_bats: 0, runs: 0, triples: 0,
            homeruns: 0, runs_batted_in: 0, stolen_bases: 0, on_base_percentage: .000, batting_average: .000,
            strikeouts: 0, walks: 0, wins: 0, losses: 0, hits_allowed: 0, innings_pitched: 0.0,
            runs_allowed: 0, walks_allowed : 0, earned_runs: 0, earned_run_average: 0.00, strikeouts_thrown: 0,
            saves: 0};

        DatabaseController.query("INSERT INTO stats (player_id, hits, doubles, games_played, at_bats, runs, triples, homeruns, runs_batted_in, stolen_bases, on_base_percentage, batting_average, strikeouts, walks, wins, losses, hits_allowed, innings_pitched, runs_allowed, walks_allowed, earned_runs, earned_run_average, strikeouts_thrown, saves)" +
            "VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24) RETURNING *", [id, statsMap.hits, statsMap.doubles,
            statsMap.games_played, statsMap.at_bats, statsMap.runs, statsMap.triples, statsMap.homeruns, statsMap.runs_batted_in, statsMap.stolen_bases, statsMap.on_base_percentage,
            statsMap.batting_average, statsMap.strikeouts, statsMap.walks, statsMap.wins, statsMap.losses, statsMap.hits_allowed, statsMap.innings_pitched, statsMap.runs_allowed,
            statsMap.walks_allowed, statsMap.earned_runs, statsMap.earned_run_average, statsMap.strikeouts_thrown, statsMap.saves]).then(function(stats){
            resolve(stats);
        }).catch(function(err){
            reject("" + err);
        });
    });
}
