var _ = require('./Utils.js');
var Troncon = require('../models/troncon.js').troncon;

exports.getAll = function(req, res) {
    Troncon
        .find()
        .populate('route')
        .then(function (result){
            _.response.sendObjectData(res,result);
        })
        .catch(function (err){
            _.response.sendError(res, err, 500);
        });
}
exports.getAllforOne = function(req, res) {
    var idr = req.params.idr;
    if (idr === undefined ) {
        _.response.sendError(res, 'pas de route spécifiée', 500);
    }
    Troncon
        .find({route: idr})
        .populate('route')
        .then(function (result){
            _.response.sendObjectData(res,result);
        })
        .catch(function (err){
            _.response.sendError(res, err, 500);
        });
}

exports.infoTroncon = function(req, res) {
    var idt = req.params.id;
    Troncon
        .findById(idt)
        .populate('route')
        .then(function (result){
            _.response.sendObjectData(res,result);
        })
        .catch(function (err){
            _.response.sendError(res, err, 500);
        });
}

exports.createTroncon = function(req, res) {
    // check radar validity
    if (req.params.idr === undefined ) {
        _.response.sendError(res, 'Pas de route spécifiée', 400);
        return;
    }
    // create new section
    var newTroncon = new Troncon({
        touristique: req.body.touristique,
        vitesseMax: req.body.vitesseMax,
        longueur: req.body.longueur,
        radar: req.body.radar,
        route: req.params.idr
    });
    // save it
    newTroncon.save(function (error,troncon) {
        if (error) {
            _.response.sendError(res, error, 500);
            return;
        }
        newTroncon.__v = undefined;
        _.response.sendObjectData(res,troncon);
    });
}

exports.updtTroncon = function (req, res) {
    var idt = req.params._id;
    Troncon.findByIdAndUpdate(idt, { 
        "touristique": req.body.touristique,
        "vitesseMax": req.body.vitesseMax,
        "longueur": req.body.longueur,
        "radar": req.body.radar 
        })
}

exports.supprimerTroncon = function (req, res) {
    var idt = req.params._id;
    Troncon.findByIdAndDelete(idt, function (error) {
        if (error) {
            _.response.sendError(res, error, 500);
            return;
        }
        _.response.sendSuccess(res, 'Troncon est supprimée.');
    })
}