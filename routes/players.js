var express = require('express');
var router = express.Router();

var PlayersController = require('./../Controller/PlayersController');

router.get('/', function(req, res, next) {
    PlayersController.getPlayers().then(function(data){
        res.status(200).json({players: data});
    }).catch(function(err){
        res.status(200).json({success: false, message:""+ err});
    });
});

module.exports = router;
