var _ = require('./utils');
var authentication = require("./authentication");
var User = require('../models/user.js').user;
var option = require('../models/option').option;
var vehicule = require('../models/vehicule').vehicule;

exports.create = function(req,res) {
    // check mail validity
    if (
        req.body.mail === undefined ||
        req.body.mail.length < 2 /*||
        req.body.mail.indexOf(' ') > -1*/) {
            _.response.sendError(res, 'Invalid mail.', 400);
            return;
            }
    // check nom validity
    if (
        req.body.nom === undefined ||
        req.body.nom.length < 2 ) {
            _.response.sendError(res, 'Invalid name.', 400);
            return;
            }

    // check prenom validity
    if (
        req.body.prenom === undefined ||
        req.body.prenom.length < 2 ) {
            _.response.sendError(res, 'Invalid surname.', 400);
            return;
            }
    
    // check password validity
    if (
        req.body.password === undefined ||
        req.body.password.length < 8) {
             _.response.sendError(res, 'Invalid password.', 400);
            return;
            }
    
    // generate salt and hash
    authentication.helper.generateSaltAndHash(
        req.body.password,
        function (error, salt, hash) {
        // error happened when generating salt and hash
        if (error) {
            _.response.sendError(res, "erreur lors de la génération du sel et du hash", 500);
            return;
        }

        // create new user
        var user = new User({
            mail: req.body.mail,
            nom : req.body.nom,
            prenom: req.body.prenom,
            salt: salt,
            hash: hash,
        });

        // save it
        user.save(function (error, user) {
            console.log(error);
            if (error && error.code === 11000) {
            error = 'Invalid mail (duplicate).';
            _.response.sendError(res, error, 500);
            return;
            } else {
            user.__v = undefined;
            }

            console.log(user);
            option.create({
                plusCourt: true,
                plusRapide: false,
                sansRadar: false,
                sansPeage: false,
                etapes: false,
                touristique: false,
                utilisateur: user._id
            }).then(function (option){
                console.log(option)
                return vehicule.create({
                    nom: "vehicule par défaut",
                    qteCO2Neuf: 129,
                    etatRoues: 0,
                    age: 0,
                    utilisateur: user._id
                });
            }).then(function (vehicule){
                console.log(vehicule);
                _.response.sendSuccess(res, "utilisater, option par défaut et véhicule par défauts créés : " + user.nom + " " + user.prenom);
            }).catch(function (err){
                _.response.sendError(res,err,500);
            });
        });
        }
    );
}