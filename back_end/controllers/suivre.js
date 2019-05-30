var _ = require('./Utils.js');
var Troncon = require('../models/troncon.js').troncon;
var Itineraire = require('../models/itineraire').itineraire;
var Option = require('../models/option').option;

var chemins = []; // an array to record all possible paths

exports.getInfoItineraire = function(req, res) {
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
                var chemins_tries = tri_par_option(option, chemins);
                setTimeout(function(){
                    resolve();
                }, 1000);
            }).then(function () {
                _.response.sendObjectData(res,chemins_tries);
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
    return c;
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
    return c;
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
    return cheminSr;
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
    return cheminSp;
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
    return c;
}