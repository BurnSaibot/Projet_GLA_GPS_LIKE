var mongoose = require("mongoose");  
var Schema = mongoose.Schema; 

var itineraireSchema = new Schema({
    villeDepart : {
        type: Schema.Types.ObjectId,
        ref: 'ville',
        required : true
    },
    villeArrivee : {
        type: Schema.Types.ObjectId,
        ref: 'ville',
        required : true
    },
    date : Date,
    utilisateur : {
        type: Schema.Types.ObjectId,
        ref: 'utilisateur'
    },
    vehicule : {
        type: Schema.Types.ObjectId,
        ref: 'vehicule'
    },
    optionsAssocies : {
        type: Schema.Types.ObjectId,
        ref: 'option'
    },
    villeEtapes : [{
        type: Schema.Types.ObjectId,
        ref: 'ville'
    }]
    
}); 

exports.itineraire = mongoose.model('itineraire', itineraireSchema); 