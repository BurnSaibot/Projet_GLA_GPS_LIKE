var _ = require('./Utils.js');
var Route = require('../models/route.js').route;
var type = require('../models/route.js').typeRoute;


exports.listeRoutes = function(req, res) {
        Route.find(function(error, routes){
            if (error) {
                _.response.sendError(res, error, 500);
                return;
            }
            res.json(routes);
            _.response.sendSuccess(res,'liste de routes créé.');
        });
}

exports.infoRoute = function(req, res) {
        var idr = req.params._id;
        Ville.findById(idr, function(error, route){
            if (error) {
                _.response.sendError(res, error, 500);
                return;
            }
            res.json(route);
        });
}

exports.createRoute = function(req, res) {
        // check name validity
        if (req.body.nom === undefined ||
            req.body.nom.length < 2) {
                _.response.sendError(res, 'Invalid nom', 400);
                return;
            }
        // check type validity
        if (req.body.taille === undefined ||
            (req.body.taille != type.route &&
                req.body.taille != type.departementale &&
                req.body.taille != type.autoroute &&
                req.body.taille != type.nationale &&
                req.body.taille != type.europeenne)) {
            _.response.sendError(res, 'Invalid type', 400);
            return;
        }
        // create new road
        var newRoute = new Route({
            nom: req.body.nom,
            taille: req.body.taille,
            villeDepart: req.body.villeDepart,
            villeArrivee: req.body.villeArrivee
        });

        // save it
        newRoute.save(function (error) {
            if (error) {
                _.response.sendError(res, error, 500);
                return;
            }
            newRoute.__v = undefined;
            _.response.sendSuccess(res,'route créée.')
        });
}

exports.updtRoute = function (req, res) {
        var idr = req.params._id;
        if (req.body.nom != undefined) {
            Ville.findByIdAndUpdate(idr, { "nom": req.body.nom }, function (error) {
                if (error) {
                    _.response.sendError(res, error, 500);
                    return;
                }
            });
        }
        if (req.body.taille != undefined &&
            (req.body.taille != type.route &&
                req.body.taille != type.departementale &&
                req.body.taille != type.autoroute &&
                req.body.taille != type.nationale &&
                req.body.taille != type.europeenne)) {
            Ville.findByIdAndUpdate(idr, { "taille": req.body.taille },
                function (error) {
                    if (error) {
                        _.response.sendError(res, error, 500);
                        return;
                    }
                });
        }
        if (req.body.villeDepart != undefined) {
            Ville.findByIdAndUpdate(idr, { "villeDepart": req.body.villeDepart },
                function (error) {
                    if (error) {
                        _.response.sendError(res, error, 500);
                        return;
                    }
                });
        }
        if (req.body.villeArrivee != undefined) {
            Ville.findByIdAndUpdate(idr, { "villeArrivee": req.body.villeArrivee },
                function (error) {
                    if (error) {
                        _.response.sendError(res, error, 500);
                        return;
                    }
                });
        }
        _.response.sendSuccess(res, 'ville modifiée.')
}

exports.supprimerRoute = function (req, res) {
        var idr = req.params._id;
        Ville.findByIdAndDelete(idr, function (error) {
            if (error) {
                _.response.sendError(res, error, 500);
                return;
            }
            _.response.sendSuccess(res, 'Route est supprimée.');
        })
}