var mongoose = require("mongoose");  
var Schema = mongoose.Schema; 

// var tronconSchema = new Schema({
//     touristique: {
//         type: Boolean,
//         required: true
//     },
//     vitesseMax: {
//         type: Number,
//         required: true
//     },
//     longueur: {
//         type: Number,
//         required: true
//     },
//     radar: {
//         type: Boolean,
//         required: true
//     },
//     peage: {
//         type: Boolean,
//         required: true
//     },
//     route: {
//         type: Schema.Types.ObjectId,
//         ref: 'route'
//     },
//     ville1: {
//         type: Schema.Types.ObjectId,
//         ref: 'ville'
//     },
//     ville2: {
//         type: Schema.Types.ObjectId,
//         ref: 'ville'
//     }
// }); 

var tronconSchema = new Schema({
    ville1: {
        type: String,
        required: true
    },
    ville2: {
        type: String,
        required: true
    },
    vitesse: {
        type: Number,
        required: true
    },
    touristique: {
        type: String,
        required: true
    },
    radar: {
        type: String,
        required: true
    },
    payant: {
        type: String,
        required: true
    },
    longueur: {
        type: Number,
        required: true
    }
}); 



exports.troncon = mongoose.model('troncon', tronconSchema); 