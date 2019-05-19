var _ = require('./Utils.js');
var Ville = require('../models/ville.js').ville;
var type = require('../models/ville.js').type;
var cType = require('../models/ville.js').isCorrectType;

exports.listeVilles = function(req, res) {
        Ville.find(function(error, villes){
            if (error) {
                _.response.sendError(res, error, 500);
                return;
            }
            _.response.sendObjectData(res,villes);
        });
}

exports.infoVille = function(req, res) {
        var idv = req.params.id;
        Ville.findById(idv, function(error, ville){
            if (error) {
                _.response.sendError(res, error, 500);
                return;
            }
            res.json(ville);
        });
}

exports.createVille = function(req, res) {
        // check name validity
        if (req.body.nom.length < 2) {
                _.response.sendError(res, 'Taille du nom invalide', 400);
                return;
            }
        // check type validity
        //console.log(cType(req.body.taille));
        if (!cType(req.body.taille) ) {
            _.response.sendError(res, 'Invalid type : ' + req.body.taille + " must be 'petite', 'moyenne' or 'grande'", 400);
            return;
        }
        // create new city
        var newVille = new Ville({
            nom: req.body.nom,
            taille: req.body.taille,
            touristique: req.body.touristique
        });

        // save it
        newVille.save(function (error,ville) {
            if (error) {
                _.response.sendError(res, error, 500);
                return;
            }
            newVille.__v = undefined;
            _.response.sendObjectData(res,ville);
        });
}

exports.updtVille = function (req, res) {
        var idv = req.params.id;
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


exports.supprimerVille = function (req, res) {
        var idv = req.params._id;
        Ville.findByIdAndDelete(idv, function (error) {
            if (error) {
                _.response.sendError(res, error, 500);
                return;
            }
            _.response.sendSuccess(res, 'Ville est supprimée.');
        })
}