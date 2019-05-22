var mongoose = require("mongoose");  
var Schema = mongoose.Schema; 

var optionSchema = new Schema({
    plusCourt: {type: Boolean, required: true},
    plusRapide: {type: Boolean, required: true},
    sansRadar: {type: Boolean, required: true},
    sansPeage: {type: Boolean, required: true},
    etapes: {type: Boolean, required: true},
    touristique: {type: Boolean, required: true},
    villesEtapes: [{
        type: Schema.Types.ObjectId,
        ref: 'ville'
    }],
    //on enregistre dans la bdd que les sets d'options par défaut de l'utilisateurs et ceux liés à un itinéraire dans un historique.
    utilisateur: {
        type: Schema.Types.ObjectId,
        ref: 'utilisateur',
        index: {
            unique:true,
            partialFilterExpression: {
                utilisateur: {$type: Schema.Types.ObjectId}
        }
        }
    }
}); 


exports.option = mongoose.model('option', optionSchema);

