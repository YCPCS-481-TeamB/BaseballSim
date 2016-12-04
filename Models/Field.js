var bluebird = require('bluebird');
var Promise = bluebird.Promise;

var DatabaseController = require("./../Controller/DatabaseController");

//TODO: Finish Migrating League Model

module.exports =  {
    //TODO: Add league id to fields...
    create : function(name, team_id){
        return new Promise(function(resolve, reject){
            DatabaseController.query("INSERT INTO fields (name,team_id) VALUES($1, $2) RETURNING *", [name, team_id]).then(function(result){
                resolve(result.rows[0]);
            }).catch(function(err){
                reject(err);
            });
        });
    },
    update : function(){
        return new Promise(function(resolve, reject){

        });
    },
    getAll : function(limit, offset){
        return new Promise(function(resolve, reject){

        });
    },
    getById : function(id){
        return new Promise(function(resolve, reject){

        });
    },
    getAllByUserPermission : function(user_id){
        return new Promise(function(resolve, reject){

        });
    },
    deleteById : function(id){
        return new Promise(function(resolve, reject){

        });
    }
}