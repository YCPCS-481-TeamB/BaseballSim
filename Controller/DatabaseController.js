var pg = require('pg');

var pool = new pg.Pool(config);

exports.module = {

    query : function(query, args){

       return new Promise(function(resolve, reject){
           pool.connect(function(err, client, done){
               client.query(query, args, function(err, result){
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
               });
           });
       });

    }

}