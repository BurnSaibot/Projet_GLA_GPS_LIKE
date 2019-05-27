var mongoose = require("mongoose");  
var Schema = mongoose.Schema; 

var tronconSchema = new Schema({
    touristique: {
        type: Boolean,
        required: true
    },
    vitesseMax: {
        type: Number,
        required: true
    },
    longueur: {
        type: Number,
        required: true
    },
    radar: {
        type: Boolean,
        required: true
    },
    peage: {
        type: Boolean,
        required: true
    },
    route: {
        type: Schema.Types.ObjectId,
        ref: 'route'
    },
    ville1: {
        type: Schema.Types.ObjectId,
        ref: 'ville'
    },
    ville2: {
        type: Schema.Types.ObjectId,
        ref: 'ville'
    }
}); 

exports.troncon = mongoose.model('troncon', tronconSchema); 