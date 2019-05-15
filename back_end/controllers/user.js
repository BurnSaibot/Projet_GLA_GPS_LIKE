var _ = require('./utils');
var User = require('../models/user');

exports.create = function(req,res) {
    // check mail validity
    if (
        req.body.mail === undefined ||
        req.body.mail.length < 2 ||
        req.body.mail.indexOf(' ') > -1) {
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
    Authentication.helper.generateSaltAndHash(
        req.body.password,
        function (error, salt, hash) {

        // error happened when generating salt and hash
        if (error) {
            _.response.sendError(res, error, 500);
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
            if (error && error.code === 11000) {
            error = 'Invalid mail (duplicate).';
            _.response.sendError(res, error, 500);
            } else {
            user.__v = undefined;
            }

            // send validation (or error, if any)
            _.response.sendObjectData(res,user);
            //_.response.sendSuccess(res,'utilisateur créé.')
        });
        }
    );
}