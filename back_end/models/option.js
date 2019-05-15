var mongoose = require("mongoose");  
var Schema = mongoose.Schema; 

var optionSchema = new Schema({
    plusCourt: Boolean,
    plusRapide: Boolean,
    sansRadar: Boolean,
    sansPeage: Boolean,
    etapes: Boolean,
    touristique: Boolean,
    villesEtapes: [{
        type: Schema.Types.ObjectId,
        ref: 'ville'
    }],
    //on enregistre dans la bdd que les sets d'options par défaut de l'utilisateurs et ceux liés à un itinéraire dans un historique.
    utilisateur: {
        type: Schema.Types.ObjectId,
        ref: 'utilisateur'
    }
}); 

exports.option = mongoose.model('option', optionSchema); 