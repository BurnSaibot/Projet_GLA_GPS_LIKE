var mongoose = require("mongoose");  
var Schema = mongoose.Schema; 

const typeRoute = Object.freeze({
    chemin: "Chemin",
    route: "Route",
    departementale: "Départementale",
    autoroute: "Autoroute",
    nationale: "Nationale",
    europeenne: "Européenne"
});

var waySchema = new Schema({
    nom: String,
    taille: {
        type: String,
        enum: Object.values(typeRoute)
    },
    villeDepart: {
        type: Schema.Types.ObjectId,
        ref: 'ville'
    },
    villeArrivee: {
        type: Schema.Types.ObjectId,
        ref: 'ville'
    }
    // pour trouver les tronçons d'une route r, on cherche juste les tronçons qui ont pour champ route la route r
}); 

exports.route = mongoose.model('routes', waySchema); 
exports.typeRoute = typeRoute;