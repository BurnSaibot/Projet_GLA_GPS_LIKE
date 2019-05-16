var _ = require('./Utils.js');
var Ville = require('../models/ville.js').ville;
var type = require('../models/ville.js').type;

checkAdmin = function(req) {
    if (req.session.user.admin) {
        return true;
    } else {
        return false;
    }
}

exports.listeVilles = function(req, res) {
    if (checkAdmin(req)) {
        Ville.find(function(error, villes){
            if (error) {
                _.response.sendError(res, error, 500);
                return;
            }
            res.json(villes);
            _.response.sendSuccess(res,'liste de villes créé.');
        });
    } else {
        _.response.sendError(res, error, 500);
        return;
    }
}

exports.infoVille = function(req, res) {
    if (checkAdmin(req)) {
        var idv = req.params._id;
        Ville.findById(idv, function(error, ville){
            if (error) {
                _.response.sendError(res, error, 500);
                return;
            }
            res.json(ville);
        });
    } else {
        _.response.sendError(res, error, 500);
        return;
    }
}

exports.createVille = function(req, res) {
    if (checkAdmin(req)) {
        // check name validity
        if (req.body.nom === undefined ||
            req.body.nom.length < 2) {
                _.response.sendError(res, 'Invalid nom', 400);
                return;
            }
        // check type validity
        if (req.body.taille === undefined ||
            (req.body.taille != type.petite &&
                req.body.taille != type.moyenne &&
                req.body.taille != type.grande)) {
            _.response.sendError(res, 'Invalid type', 400);
            return;
        }
        // check touristic validity
        if (req.body.touristique === undefined ||
            typeof req.body.touristique != "boolean") {
            _.response.sendError(res, 'Invalid touristic', 400);
            return;
        }

        // create new city
        var newVille = new Ville({
            nom: req.body.nom,
            taille: req.body.taille,
            touristique: req.body.touristique
        });

        // save it
        newVille.save(function (error) {
            if (error) {
                _.response.sendError(res, error, 500);
                return;
            }
            newVille.__v = undefined;
            _.response.sendSuccess(res,'ville créée.')
        });
    }
}

exports.updtVille = function (req, res) {
    if (checkAdmin(req)) {
        var idv = req.params._id;
        if (req.body.nom != undefined) {
            Ville.findByIdAndUpdate(idv, { "nom": req.body.nom }, function (error) {
                if (error) {
                    _.response.sendError(res, error, 500);
                    return;
                }
            });
        }

        if (req.body.taille != undefined &&
            (req.body.taille === type.petite ||
                req.body.taille === type.moyenne ||
                req.body.taille === type.grande)) {
            Ville.findByIdAndUpdate(idv, { "taille": req.body.taille },
                function (error) {
                    if (error) {
                        _.response.sendError(res, error, 500);
                        return;
                    }
                });
        }

        if (req.body.touristique != undefined &&
            typeof req.body.touristique != "boolean") {
            Ville.findByIdAndUpdate(idv, { "touristique": req.body.touristique },
                function (error) {
                    if (error) {
                        _.response.sendError(res, error, 500);
                        return;
                    }
                });
        }
        _.response.sendSuccess(res, 'ville modifiée.')
    }
}


exports.supprimerVille = function (req, res) {
    if (checkAdmin(req)) {
        var idv = req.params._id;
        Ville.findByIdAndDelete(idv, function (error) {
            if (error) {
                _.response.sendError(res, error, 500);
                return;
            }
            _.response.sendSuccess(res, 'Ville est supprimée.');
        })
    }
}