var xml2js = require('xml2js').parseString;
var fs = require('fs');
var Route = require('../models/route').route;
var Troncon = require('../models/troncon').troncon;
var Ville = require('../models/ville').ville;

module.exports = function(mapURL) {
    var map;
    //reading a file
    fs.readFileAsync(mapURL)
    //parsing it
    .then( function(xmlContent){
        console.log("started to parse")
        return new Promise(function(resolve, reject)
        {
            xml2js(xmlContent, function(err, result){
                if(err){
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    })
    .then(function (content) {
        //map = content;
        content.reseau.ville.forEach(function (v) {
            console.log(v);
            let t = (v.type[0] == 'oui');
            Ville.create({
                nom : v.nom[0],
                taille : v.type[0],
                touristique : t
            })
        })
        content.reseau.
    })
    .catch(function (err){
        console.log(err);
    })
}

fs.readFileAsync = function (filename) {
    console.log("started to read");
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, buffer) => {
            if (err) 
                reject(err); 
            resolve(buffer);
        });
    });
};