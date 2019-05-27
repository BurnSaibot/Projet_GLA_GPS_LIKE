var _ = require('./Utils.js');
var Troncon = require('../models/troncon.js').troncon;
var Ville = require('../models/ville.js').ville;
var Itineraire = require('../models/itineraire').itineraire;


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
            var liste_troncon = [];
            var ville_marquee = [];
            calculer_chemin(vd, va, liste_troncon, ville_marquee);
            var chemins_tries = trier(option);
            _.response.sendObjectData(res,chemins_tries);
        })
        .catch(function (err){
            _.response.sendError(res, err, 500);
        });
}

get_troncon = function(vd, res) {
    Troncon
        .find({'ville1': vd}, function(error, t){
            if (error) {
                _.response.sendError(res, 'pas de troncon spécifiée', 500);
            }
            return t;
        })
}

get_nom_ville = function(id) {
    Ville
        .find({ville: id})
        .populate('ville')
        .then(function (result){
            return result.nom;
        })
        .catch(function (err){
            _.response.sendError(res, err, 500);
        });
} 

// a recursive function to browse all paths and find possible paths
calculer_chemin = function(vd, va, liste_troncon, ville_marquee) {
    var troncons_possible = get_troncon(vd);
    troncons_possible.forEach(troncon => {
        var tron = new Array(); 
        tron['villeDepart'] = get_nom_ville(troncon.ville1); 
        tron["villeArrivee"] = get_nom_ville(troncon.ville2); 
        tron['touristique'] = troncon.touristique;
        tron['vitesseMax'] = troncon.vitesseMax;
        tron['longueur'] = troncon.longueur;
        tron['radar'] = troncon.radar;
        tron['peage'] = troncon.peage;
        tron['route'] = troncon.route;
        if (troncon.ville2 === va) {
            liste_troncon.push(tron);
            chemins.push(liste_troncon);
            return;
        }
        if (ville_marquee.find(troncon.ville2)) {
            return;
        }
        ville_marquee.push(vd);
        liste_troncon.push(tron);
        calculer_chemin(troncon.ville2, va, liste_troncon, ville_marquee);
    });
}

// sort the paths with the choice of option
trier = function(ido) {
    var ct = tri_plus_court(chemins);
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

// ########## sort by the shortest  ##########
// function to calculate the length of a path
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
    return c;
} 

// ########## sort by the fastest  ##########
// function to calculate the time
temps_total = function(liste_troncon) {
    var temps = 0;
    liste_troncon.forEach(tron => {
        temps += tron.longueur/tron.vitesseMax;
    });
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
    return c;
}

// ########## sort by without radar  ##########
// function to check no radar
sans_radars = function(liste_troncon) {
    liste_troncon.forEach(tron => {
        if (tron.radar) {
            return false;
        }
    });
    return true;
}
tri_sans_radars = function(c) {
    var cheminSr = [];
    c.forEach(liste_troncon => {
        if (sans_radars(liste_troncon)) {
            cheminSr.push(liste_troncon);
        }
    });
    return cheminSr;
}

// ########## sort by without toll  ##########
// function to check no toll
sans_peages = function(c) {
    liste_troncon.forEach(tron => {
        if (tron.peage) {
            return false;
        }
    });
    return true;
}
tri_sans_peages = function(c) {
    var cheminSp = [];
    c.forEach(liste_troncon => {
        if (sans_peages(liste_troncon)) {
            cheminSp.push(liste_troncon);
        }
    });
    return cheminSp;
}

// ########## sort by the most touristy  ##########
// function to calculate the number of city touristic
touristique_total = function(liste_troncon) {
    var t = 0;
    liste_troncon.forEach(tron => {
        if (tron.touristique) {
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
    return c;
}
