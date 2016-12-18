var express = require('express');
var router = express.Router();

var FieldsController = require('./../Controller/FieldsController');
var TeamModel = require('./../Models/Team');

/**
 * GET for getting all fields from database
 * @query limit - limit on the number of record pulled
 * @query offset - offset on pulling items
 */
router.get('/', function(req, res, next) {
    var limit = req.query.limit;
    var offset = req.query.offset;
    FieldsController.getFields(limit, offset).then(function(data){
        res.status(200).json(data);
    }).catch(function(err){
        res.status(200).json({success: false, message:""+ err});
    });

});

/**
 * POST for adding a random field to the database
 * @body  team_id (Optional) - the id of the team for the field, otherwise
 * @Returning the json data for the database tables
 */
router.post('/', function(req, res, next){
    var team_id = req.body.team_id;
    TeamModel.getById(team_id).then(function(team){
        if(team.length > 0) {
            FieldsController.createField(team[0].name + '\'s field', team_id).then(function (data) {
                res.status(200).json(data);
            }).catch(function (err) {
                res.status(500).json("" + err);
            });
        }else{
            res.status(500).json({success: false, message: "Team with that id does not exist"});
        }
    }).catch(function(err){
        res.status(500).json(""+err);
    });
});

/**
 * Retrieves the field from the database with the given id value
 * @params id - The id of the field
 * @Returning list of fields matching that id
 */
router.get('/:id', function(req, res, next){
    var id = req.params.id;
    FieldsController.getFieldsById(id).then(function(data){
        res.status(200).json({id: id, fields: data});
    }).catch(function(err){
        res.status(200).json({success: false,id: id, message:""+ err});
    });
});

module.exports = router;
