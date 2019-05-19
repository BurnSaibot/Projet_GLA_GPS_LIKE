var _ = require('./Utils.js');
var Option = require('../models/option.js').option;


exports.get = function(req,res) {
    var idu = req.session.user._id;
    Option.find({utilisateur: idu},"-utilisateur")
    .then(function (result){
        _.response.sendObjectData(res,result);
    })
    .catch(function (err){
        _.response.sendError(err);
    })
}

exports.updtOption = function (req, res) {
    var idu = req.session.user._id;
    //check if we have one & only one bool for "calculation mode" to true
    if (
        req.body.plusRapide && req.body.plusCourt ) {
            _.response.sendError(res, 'On ne peut pas avoir plus rapide et plus court en meme temps !', 400);
            return;
        }

    //check if we have one & only one bool for "calculation mode" to true
    if (
        !(req.body.plusRapide || req.body.plusCourt )) {
            _.response.sendError(res, 'Il faut choisir entre plus court et plus rapide', 400);
            return;
        }
    
    Option
        .update({utilisateur: idu},{
            plusCourt: req.body.plusCourt,
            plusRapide: req.body.plusRapide,
            sansRadar: req.body.sansRadar,
            sansPeage: req.body.sansPeage,
            touristique: req.body.touristique
        })
        .then(function (result) {
            _.response.sendSuccess(res,"le set d'option a bien été mis à jour");
        })
        .catch(function (err) {
            _.response.sendError(res, err, 500);
        })
    }