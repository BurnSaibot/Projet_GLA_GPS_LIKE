var mongoose = require("mongoose");  
var Schema = mongoose.Schema;

//créer une énumération pour le type de ville.
const type = Object.freeze({
    petite: "petite",
    moyenne: "moyenne",
    grande: "grande"
});

var citySchema = new Schema({
    nom: {
        type: String,
        required: true
    },
    taille: {
        type: String,
        enum: Object.values(type),
        required: true
    },
    touristique: {
        type:Boolean,
        required:true,
    }
    /* 
    pour les villes entrantes et sortante, on cherchera juste dans route de la maniere suivante:
    - si on veut une route pour partir de la ville avec l'id vi, on cherchera une route dont la ville de depart a pour id vi
    - si on veut une route pour arriver de la ville avec l'id vi, on cherchera une route dont la ville d'arrivee a pour id vi
    */

}); 


exports.ville = mongoose.model('ville', citySchema); 
exports.types = type; 
exports.isCorrectType = function(test) {
    for ( var t in type) {
        //console.log(t + " = " + test + " ? ")
        if (t === test) {
            return true;
        }
    }
    return false;
}