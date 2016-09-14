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

router.post('/', function(req, res, next){
    PlayersController.createRandomPlayer("Brandon", "Walton", 'pitcher', 0).then(function(data){
        res.status(200).json(data);
    }).catch(function(err){
       res.status(200).json(err);
    });
});

router.get('/:id', function(req, res, next){
    var id = req.params.id;
    PlayersController.getPlayersById(id).then(function(data){
        res.status(200).json({id: id, player: data});
    }).catch(function(err){
        res.status(200).json({success: false,id: id, message:""+ err});
    });
});

module.exports = router;
