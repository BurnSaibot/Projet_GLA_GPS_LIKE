var mongoose = require("mongoose");  //  顶会议用户组件
var Schema = mongoose.Schema;    //  创建模型
var userSchema = new Schema({
    mail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    hash: String,
    salt: String,
    nom: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    prenom: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    role :{
        type: Number,
        required: true
    }
    // pour trouver le contenu de l'historique d'un utilisateur u, on cherche dans itinéraire les itinéraires dont le champ utilisateur est u
}); 

exports.user = mongoose.model('utilisateur', userSchema); //  与users集合关联