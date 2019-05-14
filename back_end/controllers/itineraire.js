var _ = require('./utils');
var itineraire = require('../models/itineraire');
var ville = require('../models/ville');

exports.getHistorique = function(req,res) {
        userID = req.session._id;
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

