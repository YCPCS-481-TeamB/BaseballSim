var pg = require('pg');
var config = require('./../Database/config.json');
var pool = new pg.Pool(config);

exports.query = function(query, args){
       return new Promise(function(resolve, reject){
           pool.connect(function(err, client, done){
               if(err){
                   console.log(err);
               }else {
                   client.query(query, args, function (err, result) {
                       if (err) {
                           reject(err);
                       } else {
                           resolve(result);
                       }
                       done();
                   });
               }
           });
       });
}

exports.update = function(table, obj_id, obj){
    var keys = Object.keys(obj);
    var sql = "UPDATE "+table+" SET ";
    var values = [];
    for(var i = 0;i<keys.length;i++){
        sql += keys[i] + "=$"+(i+1);
        values.push(obj[keys[i]]);
        if(i != keys.length-1){
            sql += ",";
        }
    }

    sql += " WHERE id="+obj_id+" RETURNING *";

    return exports.query(sql, values);
}

exports.insert = function(table, obj){
    var keys = Object.keys(obj);
    var sql = "INSERT INTO "+table+" (";
    var values = [];
    for(var i = 0;i<keys.length;i++){
        sql += keys[i];
        values.push(obj[keys[i]]);
        if(i != keys.length-1){
            sql += ",";
        }
    }
    sql += ") VALUES(";

    for(var i = 0;i<keys.length;i++){
        sql += "$"+ (i + 1);
        if(i != keys.length-1){
            sql += ",";
        }
    }
    sql += ") RETURNING *";

    return exports.query(sql, values);
}