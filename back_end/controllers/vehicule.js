var _ = require('./Utils.js');
var Vehicule = require('../models/vehicule.js').vehicule;

exports.listeVehicule = function(req, res) {
    var idu = req.session.user._id;
    Vehicule.find({"utilisateur": idu}, function(error, liste) {
        if (error) {
            _.response.sendError(res, error, 500);
            return;
        }
        res.json(liste);
    });
}

exports.detailVehicule = function(req, res) {
    var idv = req.params.id;
    Vehicule.findById(idv, function(error, vehicle) {
        if (error) {
            _.response.sendError(res, error, 500);
            return;
        }
        res.json(vehicle);
    });
}

exports.supprimerVehicule = function(req, res) {
    var idv = req.params.id;
    Vehicule.findByIdAndDelete(idv, function(error, result){
        if (error) {
            _.response.sendError(res, error, 500);
            return;
        }
        _.response.sendSuccess(res,'Vehicule a été supprimé. \n' + JSON.stringify(result));
    })
}

exports.updt = function(req, res) {
    if (
        req.body.age === undefined ||
        isNaN(req.body.age) ||
        req.body.age < 0) {
            _.response.sendError(res, 'Invalid a new age ge.', 400);
            return;
        }
    if (
        req.body.etatRoues === undefined ||
        isNaN(req.body.etatRoues) ||
        req.body.etatRoues < 0 ||
        req.body.etatRoues > 100) {
            _.response.sendError(res, 'Invalid new state.', 400);
            return;
        }
    if (
        req.body.nom === undefined ||
        req.body.nom.length < 2) {
            _.response.sendError(res, 'Invalid new name.', 400);
            return;
        }    

    var idv = req.params.id;
    Vehicule.findByIdAndUpdate(idv,{"age": req.body.age, "etatRoues":req.body.etatRoues,"nom":req.body.nom }, function(err, result){
        if(err){
            _.response.sendError(res, error, 500);
            return;
        }
        _.response.sendSuccess(res,'Véhicule a été modifié : \n' + JSON.stringify(result));
    });
}

exports.createVehicule = function(req, res) {
    // check nom validity
    if (
        req.body.nom === undefined ||
        req.body.nom.length < 2 ) {
            _.response.sendError(res, 'Invalid name.', 400);
            return;
        }
    // check CO2 validity
    if (
        req.body.qteCO2Neuf === undefined ||
        isNaN(req.body.qteCO2Neuf) ||
        req.body.qteCO2Neuf < 0) {
            _.response.sendError(res, 'Invalid CO2.', 400);
            return;
        }
    
    // check state validity
    if (
        req.body.etatRoues === undefined ||
        isNaN(req.body.etatRoues) ||
        req.body.etatRoues < 0) {
            _.response.sendError(res, 'Invalid state.', 400);
            return;
        }
    
    // check age validity
    if (
        req.body.age === undefined ||
        isNaN(req.body.age) ||
        req.body.age < 0) {
            _.response.sendError(res, 'Invalid age.', 400);
            return;
        }

    // create new vehicle
    var vehicule = new Vehicule({
        nom: req.body.nom,
        qteCO2Neuf: req.body.qteCO2Neuf,
        etatRoues: req.body.etatRoues,
        age: req.body.age,
        utilisateur: req.session.user._id
    });

    // save it
    vehicule.save(function (error, vehicle) {
        if (error) {
            _.response.sendError(res, error, 500);
        }
        vehicule.__v = undefined;
        _.response.sendSuccess(res,'vehicule créé.')
    }); 
}