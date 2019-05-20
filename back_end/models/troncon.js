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
    route: {
        type: Schema.Types.ObjectId,
        ref: 'route'
    }
}); 

exports.troncon = mongoose.model('troncon', tronconSchema); 