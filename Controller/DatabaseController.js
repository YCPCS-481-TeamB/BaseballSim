var pg = require('pg');
var config = require('./../Database/config.json');
var pool = new pg.Pool(config);

exports.query = function(query, args){

       return new Promise(function(resolve, reject){
           pool.connect(function(err, client, done){
               client.query(query, args, function(err, result){
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                   done();
               });
           });
       });
}