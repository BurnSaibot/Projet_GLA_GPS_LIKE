var _ = require('./utils');
var itineraire = require('../models/itineraire');
var options = require('../models/option');

exports.getHistorique = function(req,res) {
        userID = req.session.user._id;
        //const resultat = await 
        itineraire
            .find({utilisateur: userID},'villeDepart villeArrivee date')
            .populate('villeDepart')
            .populate('villeArrivee')
            .exec()
            .then(function(data){
                _.response.sendObjectData(res,data);
            })
            .catch(function(err){
                _.response.sendError(res,err,500);
            });
        ;
}

exports.create = function(req,res) {
    // avant de créer l'itinéraire, on doit d'abord créer son champ d'options
    // check purpose validity
    if (
        req.body.plusCourt === undefined ||
        req.body.plusRapide === undefined ||
        (plusCourt && plusRapide) ||
        (!plusCourt && !plusRapide) ) {
            _.response.sendError(res, 'choix du type d\'itinéraire invalide.', 400);
            return;
        }
    // check all boolean definition
    if ( req.body.sansRadar === undefined ) {
        _.response.sendError(res, 'sansRadar : pas de valeur précisée.', 400);
        return;
    }
    // check all boolean definition
    if ( req.body.sansPeage === undefined ) {
        _.response.sendError(res, 'sansPeage : pas de valeur précisée.', 400);
        return;
    }
    // check all boolean definition
    if ( req.body.etapes === undefined ) {
        _.response.sendError(res, 'etapes : pas de valeur précisée.', 400);
        return;
    }
    // check all boolean definition
    if ( req.body.touristique === undefined ) {
        _.response.sendError(res, 'touristique : pas de valeur précisée.', 400);
        return;
    }
    //si on a précisé des étapes, alors on vérifie que req.body.villesEtapes contient au moins une étape
    if ( req.body.etapes && villesEtapes === [] ) {
        _.response.sendError(res, 'L\'utilisateu a précisé un itinéraire avec étapes, mais pas de ville étape précisée.', 400);
        return;
    }

    var options = new options({
        plusCourt: req.body.plusCourt,
        plusRapide: req.body.plusRapide,
        sansRadar: req.body.sansRadar,
        sansPeage: req.body.sansPeage,
        etapes: req.body.villesEtapes,
        utilisateur: req.session.user._id
    });

    

}