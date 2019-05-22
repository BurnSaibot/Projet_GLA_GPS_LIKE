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

/*itineraireSchema.post('save', function (itineraireSaved){
    
    itineraireSchema.find({_id: itineraireSaved.utilisateur}).sort({date: 1})
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
    
})*/

exports.itineraire = mongoose.model('itineraire', itineraireSchema); 