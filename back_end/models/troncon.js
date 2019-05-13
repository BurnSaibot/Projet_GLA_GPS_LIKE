var mongoose = require("mongoose");  
var Schema = mongoose.Schema; 

var tronconSchema = new Schema({
    touristique:Boolean,
    vitesseMax: Number,
    longueur: Number,
    radar: Boolean,
    route: {
        type: Schema.Types.ObjectId,
        ref: 'route'
    }
}); 

exports.troncon = mongoose.model('troncon', tronconSchema); 