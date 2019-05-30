var _ = require('./Utils.js');
var Ville = require('../models/ville.js').ville;
var type = require('../models/ville.js').type;
var cType = require('../models/ville.js').isCorrectType;
var createGraph = require('ngraph.graph');

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
            _.response.sendObjectData(res, ville);
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
            global.graph.addNode(ville._id,{nom : ville.nom});
            _.response.sendObjectData(res,ville);
        });
}

exports.updtVille = function (req, res) {

    var idv = req.params.id;
    // check name validity
    if (req.body.nom.length < 2) {
        _.response.sendError(res, 'Taille du nom invalide', 400);
        return;
    }
    // check size validity
    if (!cType(req.body.taille) ) {
        _.response.sendError(res, 'Invalid type : ' + req.body.taille + " must be 'petite', 'moyenne' or 'grande'", 400);
        return;
    }
    Ville
    .findByIdAndUpdate(idv, {"taille": req.body.taille,"touristique": req.body.touristique, "nom": req.body.nom}, {useFindAndModify: false})
    .then(function (result) {
        console.log("Result : " + result);
        _.response.sendObjectData(res, result);
    })
    .catch(function (err) {
        console.log(err);
        _.response.sendError(res, err, 500);
    });
}


exports.supprimerVille = function (req, res) {
        var idv = req.params.id;
        Ville.findByIdAndDelete(idv, function (error) {
            if (error) {
                _.response.sendError(res, error, 500);
                return;
            }
            global.graph.removeNode(idv);
            global.graph.forEachLinkedNode(idv, function(linkedNode,link){
                global.graph.removeLink(link);
            })
            _.response.sendSuccess(res, 'Ville est supprimée.');
        })
}