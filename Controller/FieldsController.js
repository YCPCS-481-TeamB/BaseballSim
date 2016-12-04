var DatabaseController = require('./DatabaseController');


/**
 * Creates the field with the given parameters
 * @param name
 * @param team_id
 * @Returning Promise.<Object> Returns a promise containing the returned player data
 */
exports.createField = function(name, team_id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("INSERT INTO fields (name,team_id) VALUES($1, $2) RETURNING *", [name, team_id]).then(function(result){
            resolve(result.rows[0]);
        }).catch(function(err){
            reject(err);
        });
    });
}

/**
 * Creates a randomized field with random first and last name from the database
 * @param team_id
 * @returns {Promise}
 */
exports.createRandomField = function(team_id){
    var team_id = team_id || 0;
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT name FROM field_names WHERE isLast = 'n' OFFSET floor(random()*4) LIMIT 1").then(function(name_data){
            var name = name_data.rows[0].name;
                resolve(DatabaseController.query("INSERT INTO fields (name,team_id) VALUES($1, $2) RETURNING *", [name, team_id]));
            }).catch(function(err) {
                reject(err);
            });
    	});
}

/**
 * Deletes the field from the database
 * @param id
 */
exports.deleteField = function(id){

}

/**
 * Returns a Promise of an array of fields based on the limit and offset
 * @param limit
 * @param offset
 * @returns {Promise}
 */
exports.getFields = function(limit, offset) {
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * from fields LIMIT $1 OFFSET $2", [limit || 1000, offset || 0]).then(function(data){
            resolve({limit: limit, offset: offset, fields: data.rows});
        });
    });
}

/**
 * Returns a promise that contains an array of the fields with the requested id
 * @param id
 * @returns {Promise}
 */
exports.getFieldsById = function(id){
    return new Promise(function(resolve, reject){
        DatabaseController.query("SELECT * from fields WHERE id = $1", [id]).then(function(data){
            resolve(data.rows);
        });
    });
}