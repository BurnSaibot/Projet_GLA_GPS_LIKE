var mongoose = require("mongoose");  
var Schema = mongoose.Schema; 

const typeRoute = Object.freeze({
    chemin: "chemin",
    route: "route",
    departementale: "departementale",
    autoroute: "autoroute",
    nationale: "nationale",
    europeenne: "europeenne"
});

var waySchema = new Schema({
    nom: String,
    taille: {
        type: String,
        enum: Object.values(typeRoute)
    },
    ville1: {
        type: Schema.Types.ObjectId,
        ref: 'ville'
    },
    ville2: {
        type: Schema.Types.ObjectId,
        ref: 'ville'
    }
    // pour trouver les tronçons d'une route r, on cherche juste les tronçons qui ont pour champ route la route r
}); 


exports.route = mongoose.model('route', waySchema); 
exports.typeRoute = typeRoute;
exports.isCorrectSize = function(test) {
    for ( var t in typeRoute) {
        console.log(t + " = " + test + " ? ")
        if (t === test) {
            return true;
        }
    }
    return false;
}