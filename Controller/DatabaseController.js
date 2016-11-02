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

//exports.insert = function(table, obj){
//    return new Promise(function(resolve, reject){
//
//        var keys = obj.keys();
//        var sql = "INSERT INTO $1 (";
//
//        for(var i = 0;i<keys.length;i++){
//            sql += keys[i];
//            if(i != keys.length){
//                sql += ",";
//            }else{
//                sql += ")";
//            }
//        }
//    });
//}