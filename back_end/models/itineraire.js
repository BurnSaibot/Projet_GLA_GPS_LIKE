var mongoose = require("mongoose");  
var Schema = mongoose.Schema; 

var itineraireSchema = new Schema({
    villeDepart: {
        type: Schema.Types.ObjectId,
        ref: 'ville',
        required: true
    },
    villeArrivee: {
        type: Schema.Types.ObjectId,
        ref: 'ville',
        required: true
    },
    date: {type: Date, default: Date.now},
    utilisateur: {
        type: Schema.Types.ObjectId,
        ref: 'utilisateur'
    },
    vehicule: {
        type: Schema.Types.ObjectId,
        ref: 'vehicule'
    },
    optionsAssociees: {
        type: Schema.Types.ObjectId,
        ref: 'option'
    }
    
});

exports.itineraire = mongoose.model('itineraire', itineraireSchema); 