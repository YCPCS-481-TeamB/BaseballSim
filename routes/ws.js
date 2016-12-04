var ws = require('ws');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.status(200).json({success: true, message: "WS"});
});

//router.ws('/echo', function(ws, req) {
//    ws.on('message', function(msg) {
//        ws.send(msg);
//    });
//});

module.exports = router;