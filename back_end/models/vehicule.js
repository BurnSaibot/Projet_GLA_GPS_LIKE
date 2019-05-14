var mongoose = require("mongoose");  
var Schema = mongoose.Schema; 

var vehiculeSchema = new Schema({
    nom : {
        type : String,
        required : true,
        trim : true,
        lowercase : true
    },
    //tout est requis car ces données sont requises pour le calcul de la qte emise de CO2,
    //on donnera une valeur par défaut dans le cas où l'utilisateur ne sait pas.
    qteCO2Neuf : {
        type : Number,
        required : true
    },
    etatRoues : {
        type : Number,
        required : true
    },
    age : {
        type : Number,
        required : true
    },
    utilisateur : {
        type: Schema.Types.ObjectId,
        ref: 'utilisateur'
    }
}); 

exports.vehicule = mongoose.model('vehicule', vehiculeSchema); 