var mongoose = require("mongoose");  //  顶会议用户组件
var Schema = mongoose.Schema;    //  创建模型
var userSchema = new Schema({
    mail: String,
    password: String,
    nom: String,
    prenom: String
}); 

exports.user = mongoose.model('utilisateurs', userScheMa); //  与users集合关联