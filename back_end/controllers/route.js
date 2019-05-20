var _ = require('./Utils.js');
var Route = require('../models/route.js').route;
var type = require('../models/route.js').typeRoute;
var cTaille = require('../models/route').isCorrectSize;
var Troncon = require('../models/troncon').troncon;

exports.listeRoutes = function(req, res) {
    Route.find(function(error, routes){
        if (error) {
            _.response.sendError(res, error, 500);
            return;
        }
        _.response.sendObjectData(res, routes);
    });
}

exports.infoRoute = function (req, res) {
    var idr = req.params.id;
    Route
        .findById(idr)
        .populate('ville1')
        .populate('ville2')
        .then(function (route){
            _.response.sendObjectData(res, route);
        })
        .catch(function (err){
            _.response.sendError(res, err, 500);
        })
}

exports.createRoute = function (req, res) {
    // check name validity
    if (req.body.nom.length < 2) {
        _.response.sendError(res, 'Longueur du nom invalide (<2)', 400);
        return;
    }
    // check type validity
    if (!cTaille(req.body.taille)) {
        _.response.sendError(res, 'Taille invalide :' + req.body.taille, 400);
        return;
    }
    // create new road
    var newRoute = new Route({
        nom: req.body.nom,
        taille: req.body.taille,
        ville1: req.body.ville1,
        ville2: req.body.ville2
    });

    // save it
    newRoute.save(function (error, route) {
        if (error) {
            _.response.sendError(res, error, 500);
            return;
        }
        //newRoute.__v = undefined;
        _.response.sendObjectData(res, route);
    });
}

exports.updtRoute = function (req, res) {
    var idr = req.params.id;
    // check name validity
    if (req.body.nom.length < 2) {
        _.response.sendError(res, 'Longueur du nom invalide (<2)', 400);
        return;
    }
    // check type validity
    if (!cTaille(req.body.taille)) {
        _.response.sendError(res, 'Taille invalide :' + req.body.taille, 400);
        return;
    }
    Route.findByIdAndUpdate(idr, { 
        "nom": req.body.nom, 
        "taille": req.body.taille, 
        "ville1": req.body.ville1, 
        "ville2": req.body.ville2 
    }).then(function (route){
        console.log(route);
        _.response.sendObjectData(res, route);
    }).catch(function (err) {
        _.response.sendError(res, err, 500);
    });
}

exports.supprimerRoute = function (req, res) {
    var idr = req.params.id;
    Route
        .findByIdAndDelete(idr)
        .then(function (route) {
            var idr = route._id;
            return Troncon.deleteMany({route : idr})
        })
        .then(function (result) {
            _.response.sendSuccess(res,"la route et tous ses tronçons on été supprimés.")
        })
        .catch(function (err) {
            _.response.sendError(res,err,500);
        })

}