var _ = require("./utils");
var Itineraire = require("../models/itineraire").itineraire;
var Option = require("../models/option").option;
var Ville = require("../models/ville").ville;
var Route = require("../models/route").route;
var Troncon = require("../models/troncon").troncon;
var path = require('ngraph.path');
var createGraph = require('ngraph.graph');


exports.getHistorique = function (req, res) {
        var userID = req.session.user._id;
        //const resultat = await 
        Itineraire
            .find({utilisateur: userID},"villeDepart villeArrivee date")
            .sort({date: -1})
            .limit(10)
            .populate("villeDepart")
            .populate("villeArrivee")
            .exec()
            .then(function(data){
                _.response.sendObjectData(res,data);
            })
            .catch(function(err){
                _.response.sendError(res,err,500);
            });
};

exports.create = function (req, res) {
    // check all boolean definition
    if (req.body.villeDepart === undefined) {
        _.response.sendError(res, "villeDepart : pas de valeur précisée.", 400);
        return;
    }
    // check all boolean definition
    if (req.body.villeArrivee === undefined ) {
        _.response.sendError(res, "villeArrivee : pas de valeur précisée.", 400);
        return;
    }

    // check if depart =/= arrivée
    if (req.body.villeArrivee == req.body.villeDepart ) {
        _.response.sendError(res, "depart == arrivée interdit", 400);
        return;
    }
    // avant de créer l"itinéraire, on doit d"abord créer son champ d"options
    
    // check purpose validity
    if (
        req.body.plusCourt === undefined ||
        req.body.plusRapide === undefined ||
        (req.body.plusCourt && req.body.plusRapide) ||
        (!req.body.plusCourt && !req.body.plusRapide) ) {
            _.response.sendError(res, "choix du type d\"itinéraire invalide.", 400);
            return;
        }
    // check all boolean definition
    if (req.body.sansRadar === undefined ) {
        _.response.sendError(res, "sansRadar : pas de valeur précisée.", 400);
        return;
    }
    // check all boolean definition
    if (req.body.sansPeage === undefined ) {
        _.response.sendError(res, "sansPeage : pas de valeur précisée.", 400);
        return;
    }
    // check all boolean definition
    if (req.body.etapes === undefined ) {
        _.response.sendError(res, "etapes : pas de valeur précisée.", 400);
        return;
    }
    // check all boolean definition
    if (req.body.touristique === undefined ) {
        _.response.sendError(res, "touristique : pas de valeur précisée.", 400);
        return;
    }
    //si on a précisé des étapes, alors on vérifie que req.body.villesEtapes contient au moins une étape
    if (req.body.etapes && req.body.villesEtapes === [] ) {
        _.response.sendError(res, "L'utilisateu a précisé un itinéraire avec étapes, mais pas de ville étape précisée.", 400);
        return;
    }

    Option.create({
        plusCourt: req.body.plusCourt,
        plusRapide: req.body.plusRapide,
        sansRadar: req.body.sansRadar,
        sansPeage: req.body.sansPeage,
        touristique: req.body.touristique,
        etapes: req.body.etapes,
        villesEtapes : req.body.villesEtapes
    }).then(function (options){
        console.log("slt");
        console.log(req.body);
        return Itineraire.create({
            villeDepart: req.body.villeDepart,
            villeArrivee: req.body.villeArrivee,
            utilisateur: req.session.user._id,
            vehicule: req.body.vehicule,
            optionsAssociees: options._id,
            villeEtapes: req.body.villeEtapes
        });
    }).then(function (data){
        _.response.sendObjectData(res, data);
    }).catch(function (err){
        console.log("Erreur : " + err);
        _.response.sendError(res, err, 500);
    });
};

exports.getInfo = function (req, res) {
    Itineraire
        .findById(req.params.id)
        .populate("villeDepart")
        .populate("villeArrivee")
        .populate("vehicule")
        .populate("villeEtapes")
        .populate("optionsAssociees")
        .exec()
        .then(function (data){
            _.response.sendObjectData(res, data);
        })
        .catch(function (err){
            _.response.sendError(res, err, 500);
        });
};

exports.delete = function(req, res) {
    var id = req.params.id;
    Itineraire
        .findByIdAndDelete(id)
        .then(function(found_itineraire){
            iti = found_itineraire;
            var id_opt = found_itineraire.optionsAssociees;
            return option.findByIdAndDelete(id_opt)
        })
        .then(function() {
            _.sendSuccess(res, "itineraire et options supprimées \n" + iti);
        })
        .catch(function (err){
            _.sendError(res, err, 500);
        });
}

async function calculerItineraireNonTouristique(req,res) {
    console.log("-- Debut du calcul --");
    console.log(req.params.id);
    var id_i = req.params.id;
    var  itineraire = await
    Itineraire
        .findById(id_i)
        .populate('optionsAssociees')
        .populate('villeDepart')
        .populate('villeArrivee')
        .catch( function(err) {
            _.response.sendError(res,err,500);
        })
    const result = [];
    if (itineraire.optionsAssociees.etapes) {
        var way = calcul(itineraire.villeDepart,itineraire.optionsAssociees.villesEtapes[0],itineraire.optionsAssociees);
        way.forEach(function(elem){
            result.push({id : elem.id, nom: elem.data.nom})
        })
        var old;
        itineraire.optionsAssociees.villesEtapes.forEach(function(ve,index){
            if (index > 0 ){
                way = calcul(ve,old,itineraire.optionsAssociees);
                way.forEach(function(ville,index2){
                    if (index2 > 0) {
                        result.push({id : ville.id, nom: ville.data.nom})
                    }
                })
            }
            old = ve;
        })
        way = calcul(old,itineraire.villeArrivee,itineraire.optionsAssociees);
        way.forEach(function(elem,index){
            if (index > 0) {
                result.push({id : elem.id, nom: elem.data.nom})
            }
        })
    } else{
        var way = calcul(itineraire.villeDepart,itineraire.villeArrivee,itineraire.optionsAssociees);
        way.forEach(function(elem){
            result.push({id : elem.id, nom: elem.data.nom})
        })
    }

    
    console.log("-- Find du calcul --");
    _.response.sendObjectData(res,result);

}

function calcul(depart,fin,options){
    console.log(depart,fin,options)
    let pathFinder = path.aStar(global.graph, {
        oriented : false,
        // We tell our pathfinder what should it use as a distance function:
        distance(fromNode, toNode,link) {
            if (options.sansRadar && link.data.radar)
                return Infinity;
            if (options.sansPeage && link.data.peage)
                return Infinity;    
            if (options.plusCourt){
                return link.data.longueur;
            } else {
                return link.data.longueur / (link.data.vitesse - 5 );
            }
        }
    ,
        heuristic(fromNode, toNode) {
            // this is where we "guess" distance between two nodes.
            const toRad = (val) => val * Math.PI / 180;
            const R = 6371000; // m

            const dLat = toRad(toNode.data.latitude - fromNode.data.latitude);
            const dLon = toRad(toNode.data.longitude - fromNode.data.longitude);
            const lat1 = toRad(fromNode.data.latitude);
            const lat2 = toRad(toNode.data.latitude);

            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) 
                * Math.cos(lat1) * Math.cos(lat2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const d = R * c;
            return Math.round(d);
        }
    });
    return pathFinder.find(depart._id, fin._id);
}

var chemins = []; // an array to record all possible paths

function getInfoItineraire(req, res) {
    var idi = req.params.idi;
    if (idi === undefined ) {
        _.response.sendError(res, 'pas de itineraire spécifiée', 500);
    }
    Itineraire
        .find({itineraire: idi})
        .populate('itineraire')
        .then(function (result){
            var vd = result.villeDepart;
            var va = result.villeArrivee;
            var option = result.optionsAssociees;
           
            new Promise(function(resolve, reject){
                get_troncon(vd, va, [],[vd], Troncon);
                setTimeout(function(){
                    resolve();
                }, 2000);
            }).then(function () {
                tri_par_option(option, chemins);
            })
        })
        .catch(function (err){
            _.response.sendError(res, err, 500);
        });
}


get_troncon = function (vd, va, lt, ville_marquee) {
    // console.log(' = = = = = = = = = = = = = = = = = = = ');
    Troncon.find({ "ville1": vd }, function (err, result) {
        if (err) {
            _.response.sendError(res, 'pas de troncon spécifiée', 500);
        }
        calculer(result, va, lt, ville_marquee);
    })
}

// a recursive function to browse all paths and find possible paths
calculer = function (result, va, lt, ville_marquee) {
    result.forEach(function (t) {
        var tmp_lt = lt.slice(0);
        var tmp_vm = ville_marquee.slice(0);
        if (t.ville2 === va) {
            tmp_lt.push(t);
            chemins.push(tmp_lt);
            return;
        }
        else if (found(tmp_vm, t.ville2)) {
            return;
        } else {
            tmp_vm.push(t.ville1);
            tmp_lt.push(t);
            get_troncon(t.ville2, va, tmp_lt, tmp_vm);
        }
    });
}
found = function (vm, v2) {
    vm.forEach(v => {
        if (v === v2) return true;
    });
    return false;
}
// ########## TRI ###########
// sort the paths with the choice of option
tri_par_option = function(ido, c) {
    var ct = tri_plus_court(c);
    Option
    .find({option: ido})
    .populate('option')
    .then(function (result){
        if (result.plusCourt){
            return ct;
        }
        if (result.plusRapide) {
            tri_plus_rapide(ct);
        }
        if (result.sansRadar) {
            tri_sans_radars(ct);
        }
        if (result.sansPeage) {
            tri_sans_peages(ct);
        }
        if (result.touristique) {
            tri_plus_touristique(ct);
        }
    })
    .catch(function (err){
        _.response.sendError(res, err, 500);
    });
}

// ########## sort by the court  ##########
// function to calculate the longueur
longueur_total = function(liste_troncon) {
    var l = 0;
    liste_troncon.forEach(tron => {
        l += tron.longueur;
    });
    return l;
}

tri_plus_court = function(c) {
    var nb = c.length;
    var pos;
    var cpt;
    for (var i = 1; i<nb; i++) {
        cpt = c[i];
        pos = i - 1;
        while(pos >= 0 && longueur_total(c[pos])>longueur_total(cpt)){
            c[pos+1] = c[pos];
            pos = pos-1;
        }
        c[pos+1] = cpt;
    }
    // console.log(c);
    _.response.sendObjectData(c);
    // return c;
} 

// ########## sort by the fastest  ##########
// function to calculate the time
temps_total = function(liste_troncon) {
    var temps = 0.0;
    liste_troncon.forEach(tron => {
        temps = temps + tron.longueur/tron.vitesse;
    });
    // console.log(temps);
    return temps;
}
tri_plus_rapide = function(c) {
    var nb = c.length;
    var pos;
    var cpt;
    for (var i = 1; i<nb; i++) {
        cpt = c[i];
        pos = i - 1;
        while(pos >= 0 && temps_total(c[pos])>temps_total(cpt)){
            c[pos+1] = c[pos];
            pos = pos-1;
        }
        c[pos+1] = cpt;
    }
    // console.log(c);
    _.response.sendObjectData(c);
    // return c;
}

// ########## sort by without radar  ##########
// function to check no radar
sans_radars = function(liste_troncon) {
    var i = 0;
    while (i<liste_troncon.length) {
        if (liste_troncon[i].radar == "oui") {
            break;
        }else {
            i = i+1;
        }
    }
    if (i == liste_troncon.length) {
        return true;
    } else {
        return false;
    }
}
tri_sans_radars = function(c) {
    var cheminSr = [];
    c.forEach(liste_troncon => {
        if (sans_radars(liste_troncon)) {
            cheminSr.push(liste_troncon);
        }
    });
    // console.log(cheminSr);
    _.response.sendObjectData(cheminSr);
    // return cheminSr;
}

// ########## sort by without toll  ##########
// function to check no toll
sans_peages = function(liste_troncon) {
    var i = 0;
    while (i<liste_troncon.length) {
        if (liste_troncon[i].payant == "oui") {
            break;
        }else {
            i = i+1;
        }
    }
    if (i == liste_troncon.length) {
        return true;
    } else {
        return false;
    }
}
tri_sans_peages = function(c) {
    var cheminSp = [];
    c.forEach(liste_troncon => {
        if (sans_peages(liste_troncon)) {
            cheminSp.push(liste_troncon);
        }
    });
    // console.log(cheminSp);
    _.response.sendObjectData(cheminSp);
    // return cheminSp;
}

// ########## sort by the most touristy  ##########
// function to calculate the number of city touristic
touristique_total = function(liste_troncon) {
    var t = 0;
    liste_troncon.forEach(tron => {
        if (tron.touristique === "oui") {
            t = t + 1;
        }
    });
    return t;
}
tri_plus_touristique = function(c) {
    var nb = c.length;
    var pos;
    var cpt;
    for (var i = 1; i<nb; i++) {
        cpt = c[i];
        pos = i - 1;
        while(pos >= 0 && touristique_total(c[pos])<touristique_total(cpt)){
            c[pos+1] = c[pos];
            pos = pos-1;
        }
        c[pos+1] = cpt;
    }
    // console.log(c);
    _.response.sendObjectData(c);
}

exports.getItineraire = function getItineraire(req,res) {
    /*Itineraire
    .findById(req.params.id,'optionsAssociees')
    .populate('optionsAssociees')
    .then(function(itineraire){
        if (!itineraire.optionsAssociees.touristique) {
            
        } else {
            getInfoItineraire(req,res);
        }
    })
    .catch(function(err){
        console.log("xd")
        _.response.sendError(res,err,500);
    })*/
    calculerItineraireNonTouristique(req,res);
}