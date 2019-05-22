var _ = require("./utils");
var Itineraire = require("../models/itineraire").itineraire;
var Option = require("../models/option").option;
var Ville = require("../models/ville").ville;
var Route = require("../models/route").route;
var Troncon = require("../models/troncon").troncon;
var path = require('ngraph.path');
var createGraph = require('ngraph.graph');


exports.getHistorique = function (req, res) {
        var userID = req.session.user._id;
        //const resultat = await 
        Itineraire
            .find({utilisateur: userID},"villeDepart villeArrivee date")
            .sort({date: -1})
            .limit(10)
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

exports.create = function (req, res) {
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

    Option.create({
        plusCourt: req.body.plusCourt,
        plusRapide: req.body.plusRapide,
        sansRadar: req.body.sansRadar,
        sansPeage: req.body.sansPeage,
        touristique: req.body.touristique,
        etapes: req.body.etapes,
        villesEtapes : req.body.villesEtapes
    }).then(function (options){
        console.log("slt");
        console.log(req.body);
        return Itineraire.create({
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
        console.log("Erreur : " + err);
        _.response.sendError(res, err, 500);
    });
};

exports.getInfo = function (req, res) {
    Itineraire
        .findById(req.params.id)
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
    var id = req.params.id;
    Itineraire
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

exports.calculerItineraire = function (req,res) {
    var graph = createGraph();
    Ville
    .find()
    .then(function (villes) {
        villes.forEach(function(elem){
            graph.addNode(elem._id)
        })
        return Route.find()
    })
    .then( function (routes) {
        routes.forEach( function(elem) {
            graph.addLink(elem.ville1,elem.ville2,{weight: calculerCoutRoute(elem._id)})
        })
    })
}

var calculerCoutRoute = function(idr) {
    var cout = 0;
    Troncon.find({route : idr})
    .then(function (troncons){
        troncons.forEach(function(elem){
            cout += elem.longueur;
        })
        return cout;
    })
    .catch(function (err){
        throw new Error('Erreur lors du calcul du cout');
    })
}