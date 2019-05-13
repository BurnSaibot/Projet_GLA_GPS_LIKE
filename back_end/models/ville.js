var mongoose = require("mongoose");  
var Schema = mongoose.Schema;

//créer une énumération pour le type de ville.
const type = Object.freeze({
    petite: "Petite",
    moyenne: "Moyenne",
    grande: "Grande"
});

var citySchema = new Schema({
    nom: String,
    taille: {
        type: String,
        enum: Object.values(type)
    },
    touristique: Boolean
}); 

exports.ville = mongoose.model('villes', citySchema); 
exports.types = type; //
