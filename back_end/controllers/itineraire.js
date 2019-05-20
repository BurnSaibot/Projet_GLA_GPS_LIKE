var _ = require("./utils");
var itineraire = require("../models/itineraire");
var option = require("../models/option");


exports.getHistorique = function (req, res) {
        var userID = req.session.user._id;
        //const resultat = await 
        itineraire
            .find({utilisateur: userID},"villeDepart villeArrivee date")
            .populate("villeDepart")
            .populate("villeArrivee")
            .exec()
            .then(function(data){
                _.response.sendObjectData(res,data);
            })
            .catch(function(err){
                _.response.sendError(res,err,500);
            });
};

exports.create = function (req,res) {
    // check all boolean definition
    if (req.body.villeDepart === undefined) {
        _.response.sendError(res, "villeDepart : pas de valeur précisée.", 400);
        return;
    }
    // check all boolean definition
    if (req.body.villeArrivee === undefined ) {
        _.response.sendError(res, "villeArrivee : pas de valeur précisée.", 400);
        return;
    }

    // check if depart =/= arrivée
    if (req.body.villeArrivee == req.body.villeDepart ) {
        _.response.sendError(res, "depart == arrivée interdit", 400);
        return;
    }
    // avant de créer l"itinéraire, on doit d"abord créer son champ d"options
    
    // check purpose validity
    if (
        req.body.plusCourt === undefined ||
        req.body.plusRapide === undefined ||
        (req.body.plusCourt && req.body.plusRapide) ||
        (!req.body.plusCourt && !req.body.plusRapide) ) {
            _.response.sendError(res, "choix du type d\"itinéraire invalide.", 400);
            return;
        }
    // check all boolean definition
    if (req.body.sansRadar === undefined ) {
        _.response.sendError(res, "sansRadar : pas de valeur précisée.", 400);
        return;
    }
    // check all boolean definition
    if (req.body.sansPeage === undefined ) {
        _.response.sendError(res, "sansPeage : pas de valeur précisée.", 400);
        return;
    }
    // check all boolean definition
    if (req.body.etapes === undefined ) {
        _.response.sendError(res, "etapes : pas de valeur précisée.", 400);
        return;
    }
    // check all boolean definition
    if (req.body.touristique === undefined ) {
        _.response.sendError(res, "touristique : pas de valeur précisée.", 400);
        return;
    }
    //si on a précisé des étapes, alors on vérifie que req.body.villesEtapes contient au moins une étape
    if (req.body.etapes && req.body.villesEtapes === [] ) {
        _.response.sendError(res, "L'utilisateu a précisé un itinéraire avec étapes, mais pas de ville étape précisée.", 400);
        return;
    }

    option.create({
        plusCourt: req.body.plusCourt,
        plusRapide: req.body.plusRapide,
        sansRadar: req.body.sansRadar,
        sansPeage: req.body.sansPeage,
        etapes: req.body.villesEtapes
    }).then(function (options){
        return itineraire.create({
            villeDepart: req.body.villeDepart,
            villeArrivee: req.body.villeArrivee,
            utilisateur: req.session.user._id,
            vehicule: req.body.vehicule,
            optionsAssociees: options._id,
            villeEtapes: req.body.villeEtapes
        });
    }).then(function (data){
        _.response.sendObjectData(res, data);
    }).catch(function (err){
        _.response.sendError(res, err, 500);
    });
};

exports.getInfo = function (req, res) {
    itineraire
        .findById(req.params.itineraire)
        .populate("villeDepart")
        .populate("villeArrivee")
        .populate("vehicule")
        .populate("villeEtapes")
        .populate("optionsAssociees")
        .exec()
        .then(function (data){
            _.response.sendObjectData(res, data);
        })
        .catch(function (err){
            _.response.sendError(res, err, 500);
        });
};

exports.delete = function(req, res) {
    var id = req.params.itineraire;
    var iti ;
    itineraire
        .findByIdAndDelete(id)
        .then(function(found_itineraire){
            iti = found_itineraire;
            var id_opt = found_itineraire.optionsAssociees;
            return option.findByIdAndDelete(id_opt)
        })
        .then(function() {
            _.sendSuccess(res, "itineraire et options supprimées \n" + iti);
        })
        .catch(function (err){
            _.sendError(res, err, 500);
        });
}
