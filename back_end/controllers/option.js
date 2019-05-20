var _ = require('./Utils.js');
var Option = require('../models/option.js').option;

getOption = function(req, res) {
    if (req.plusCourt) {
        return "plusCourt";
    } else if (result.plusRapide) {
        return "plusRapide";
    } else if (result.sansRadar) {
        return "sansRadar";
    } else if (result.sansPeage) {
        return "sansPeage";
    } else if (result.etapes) {
        return "etapes";
    } else if (result.touristique) {
        return "touristique";
    }
}

exports.defaut = function(req, res) {
    var idu = req.session.user._id;
    Option.find({"utilisateur": idu}, function(error, result){
        if (error) {
            _.response.sendError(res, error, 500);
            return;
        }
        if (!result) {
            // create new option
            var option = new Option({
                plusCourt: true,
                plusRapide: false,
                sansRadar: false,
                sansPeage: false,
                etapes: false,
                touristique: false,
                villesEtapes: [],
                utilisateur: req.session.user._id
            });

            // save it
            option.save(function (error, option) {
                if (error) {
                    _.response.sendError(res, error, 500);
                    return;
                }
                option.__v = undefined;
                res.json("plusCourt");
                _.response.sendSuccess(res,'option créé.');
            });
        } else {
            var opt = getOption(result);
            res.json(opt);
        }
    });
}



// change option
exports.updtOption = function(req, res) {
    var idu = req.session._id;
    Option.findOne({"utilisateur": idu}, function(error, result){
        if (error) {
            _.response.sendError(res, error, 500);
            return;
        } else {
            var opt = getOption(result);
            var newoption = req.body.option;
            if (opt === newoption) {
                return;
            } else {
                Option.findByIdAndUpdate(result._id, { opt: false, newoption: true },
                    function (error, r) {
                    if (error) {
                        _.response.sendError(res, error, 500);
                        return;
                    } else {
                        _.response.sendSuccess(res,'option est modifié.');    
                    }
                })
            }
        }
    })
}

exports.updtOption = function (req, res) {
    var idu = req.session.user._id;

    if (
        req.body.plusCourt === undefined ) {
            _.response.sendError(res, 'Champ plusCourt non définie.', 400);
            return;
        }
    
    if (
        req.body.plusRapide === undefined ) {
            _.response.sendError(res, 'Champ plusRapide non définie.', 400);
            return;
        }
    
    //check if we have one & only one bool for "calculation mode" to true

    
    
    // check state validity
    if (
        req.body.etatRoues === undefined ||
        isNaN(req.body.etatRoues) ||
        req.body.etatRoues < 0) {
            _.response.sendError(res, 'Invalid state.', 400);
            return;
        }
}