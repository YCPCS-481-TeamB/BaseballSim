var express = require('express');
var router = express.Router();

var ApprovalsModel = require('./../Models/Approval');
var ApprovalsController = require('./../Controller/ApprovalsController');

/**
 * GET for getting all players from database
 * @query limit - limit on the number of record pulled
 * @query offset - offset on pulling items
 */
router.get('/', function(req, res, next) {
    var limit = req.query.limit;
    var offset = req.query.offset;
    ApprovalsModel.getAll(limit, offset).then(function(data){
        res.status(200).json({success: true, approvals: data});
    }).catch(function(err){
        res.status(200).json({success: false, message:""+ err});
    });
});

/**
 * GET for getting all players from database
 * @query limit - limit on the number of record pulled
 * @query offset - offset on pulling items
 */
router.get('/user', function(req, res, next) {
    var limit = req.query.limit;
    var offset = req.query.offset;
    ApprovalsModel.getByUserId(req.userdata.id).then(function(data){
        res.status(200).json({success: true, approvals: data});
    }).catch(function(err){
        res.status(200).json({success: false, message:""+ err});
    });
});

/**
 * GET for getting all players from database
 * @query limit - limit on the number of record pulled
 * @query offset - offset on pulling items
 */
router.get('/user/pending', function(req, res, next) {
    var limit = req.query.limit;
    var offset = req.query.offset;

    ApprovalsModel.getAllByUserIdAndStatus(req.userdata.id, 'pending').then(function(data){
        res.status(200).json({success: true, approvals: data});
    }).catch(function(err){
        res.status(200).json({success: false, message:""+ err});
    });
});

/**
 * GET for getting all players from database
 * @query limit - limit on the number of record pulled
 * @query offset - offset on pulling items
 */
router.get('/:itemtype/:itemid', function(req, res, next) {
    var item_type = req.params.itemtype;
    var item_id = req.params.itemid;

    ApprovalsModel.getAllByTypeAndItemId(item_type, item_id).then(function(data){
        res.status(200).json({success: true, approvals: data});
    }).catch(function(err){
        res.status(200).json({success: false, message:""+ err});
    });
});

/**
 * POST For setting approval status to true
 */
router.post('/:id/status', function(req, res, next) {
    var status = req.body.status;
    var id = req.params.id;

    ApprovalsModel.update(id, status).then(function(data){
        res.status(200).json({success: true, approvals: data});
    }).catch(function(err){
        res.status(200).json({success: false, message:""+ err});
    });
});

module.exports = router;