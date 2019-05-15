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
    },
    villeEtapes: [{
        type: Schema.Types.ObjectId,
        ref: 'ville'
    }]
    
});

itineraireSchema.post('save', function (itineraireSaved){
    /* 
        Quand un itinéraire est sauvegardé, on vérifie s'il n'y a pas plus de 10 itinéraires,
        si c'est le cas, on supprime le plus vieux pour revenir à 10
    */
    itineraireSchema.find({id: req.session.user._id}).sort({date: 1})
    .then(function(search) {
        if (search.length > 10) {
            var id_to_remove = search[0]._id;
            return itineraireSchema.findAndDeleteById({_id: id_to_remove})
        }
    })
    .then(function(dataDeleted){
        console.log('Supression de ' + dataDeleted);
    })
    .catch(function(err) {
        console.log(err);
    })
    //1 -> trié par ordre croissant
    
})

exports.itineraire = mongoose.model('itineraire', itineraireSchema); 