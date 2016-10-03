var SecurityController = require("./../Controller/SecurityController");

exports.validateTokenMiddleware = function(req, res, next){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        SecurityController.validateToken(token).then(function(data){
            req.userdata = data;
            next();
        }).catch(function(err){
            res.status(200).json({success: false, message: "Could Not Authenticate"});
        });
    }else{
        res.status(200).json("Authentication Required!");
    }
}