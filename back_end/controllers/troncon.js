var _ = require('./Utils.js');
var Troncon = require('../models/troncon.js').troncon;

checkAdmin = function(req) {
    if (req.session.user.admin) {
        return true;
    } else {
        return false;
    }
}

exports.listeTroncon = function(req, res) {
    if (checkAdmin(req)) {
        Route.find(function(error, troncons){
            if (error) {
                _.response.sendError(res, error, 500);
                return;
            }
            res.json(troncons);
            _.response.sendSuccess(res,'liste de troncons créé.');
        });
    } else {
        _.response.sendError(res, error, 500);
        return;
    }
}

exports.infoTroncon = function(req, res) {
    if (checkAdmin(req)) {
        var idt = req.params._id;
        Ville.findById(idt, function(error, troncon){
            if (error) {
                _.response.sendError(res, error, 500);
                return;
            }
            res.json(troncon);
        });
    } else {
        _.response.sendError(res, error, 500);
        return;
    }
}

exports.createTroncon = function(req, res) {
    if (checkAdmin(req)) {
        // check touristic validity
        if (req.body.touristique === undefined ||
            typeof req.body.touristique != "boolean") {
                _.response.sendError(res, 'Invalid touristic', 400);
                return;
            }
        // check speed validity
        if (req.body.vitesseMax === undefined ||
            isNaN(req.body.vitesseMax)) {
            _.response.sendError(res, 'Invalid speed', 400);
            return;
        }
        // check length validity
        if (req.body.longueur === undefined ||
            isNaN(req.body.longueur)) {
            _.response.sendError(res, 'Invalid length', 400);
            return;
        }
        // check radar validity
        if (req.body.radar === undefined ||
            typeof req.body.radar != "boolean") {
            _.response.sendError(res, 'Invalid radar', 400);
            return;
        }
        // create new section
        var newTroncon = new Troncon({
            touristique: req.body.touristique,
            vitesseMax: req.body.vitesseMax,
            longueur: req.body.longueur,
            radar: req.body.radar,
            route: req.body.route
        });
        // save it
        newTroncon.save(function (error) {
            if (error) {
                _.response.sendError(res, error, 500);
                return;
            }
            newTroncon.__v = undefined;
            _.response.sendSuccess(res,'troncon créée.')
        });
    }
}

exports.updtTroncon = function (req, res) {
    if (checkAdmin(req)) {
        var idt = req.params._id;
        if (req.body.touristique != undefined &&
            typeof req.body.touristique === "boolean") {
            Ville.findByIdAndUpdate(idt, { "touristique": req.body.touristique }, 
            function (error) {
                if (error) {
                    _.response.sendError(res, error, 500);
                    return;
                }
            });
        }
        if (req.body.vitesseMax != undefined &&
            !isNaN(req.body.vitesseMax)) {
            Ville.findByIdAndUpdate(idt, { "vitesseMax": req.body.vitesseMax },
                function (error) {
                    if (error) {
                        _.response.sendError(res, error, 500);
                        return;
                    }
                });
        }
        if (req.body.longueur != undefined &&
            !isNaN(req.body.longueur)) {
            Ville.findByIdAndUpdate(idt, { "longueur": req.body.longueur },
                function (error) {
                    if (error) {
                        _.response.sendError(res, error, 500);
                        return;
                    }
                });
        }
        if (req.body.radar != undefined &&
            typeof req.body.radar === "boolean") {
            Ville.findByIdAndUpdate(idt, { "radar": req.body.radar },
                function (error) {
                    if (error) {
                        _.response.sendError(res, error, 500);
                        return;
                    }
                });
        }
        _.response.sendSuccess(res, 'troncon modifiée.')
    }
}

exports.supprimerTroncon = function (req, res) {
    if (checkAdmin(req)) {
        var idt = req.params._id;
        Ville.findByIdAndDelete(idt, function (error) {
            if (error) {
                _.response.sendError(res, error, 500);
                return;
            }
            _.response.sendSuccess(res, 'Troncon est supprimée.');
        })
    }
}