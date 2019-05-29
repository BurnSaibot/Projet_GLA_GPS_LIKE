var createXmlStream = require('xml-flow');
var { createReadStream } = require('fs');

var Route = require('../models/route').route;
var Troncon = require('../models/troncon').troncon;
var Ville = require('../models/ville').ville;

var createGraph = require('ngraph.graph');

// Store ids associated to names (hopefully unique ?)
const promiseArray = [];
const citiesCache = {};

async function cleaupDatabase() {
    await Ville.remove({})
    await Troncon.remove({});
    await Route.remove({});
    return true;
}
const handlingCity = async function(v) {
        
    const city = await Ville.create({
        nom: v.nom,
        taille: v.type,
        touristique: v.touristique === 'oui',
        longitude: v.coordonnees.longitude,
        latitude: v.coordonnees.latitude
    })
    citiesCache[city.nom] = city._id;
};


function importCities(url) {
    const dataStream = createReadStream(url);
    const xmlStream = createXmlStream(dataStream);
    xmlStream.on('tag:ville', function(v){
        promiseArray.push(handlingCity(v));
    });

    return new Promise((resolve, reject) => {
        xmlStream.on('end', function(){
            Promise
            .all(promiseArray)
            .then(() => {
                resolve();
            })
        });
        xmlStream.on('error', reject);
    });
} 

function importRoutesAndSections(url) {
    const dataStream = createReadStream(url);
    const xmlStream = createXmlStream(dataStream);

    xmlStream.on('tag:route', async function(r) {
        const route = await Route.create({
            nom: r.nom,
            taille: r.type
        });
        
        r.troncon.forEach(function (t){
            Troncon.create({
                ville1: citiesCache[t.ville1],
                ville2: citiesCache[t.ville2],
                route: route._id,
                peage: t.peage === 'oui',
                radar: t.radar === 'oui',
                touristique: t.touristique === 'oui',
                longueur: t.longueur,
                vitesseMax: t.vitesse,
            });
        });
    });

    return new Promise((resolve, reject) => {
        xmlStream.on('end', resolve);
        xmlStream.on('error', reject);
    });
} 


exports.initDB = async function(url) {
    await cleaupDatabase();
    await importCities(url);
    await importRoutesAndSections(url);
}
exports.initGraph = function(){
    var graph = createGraph();
    // pour ne pas casser la mémoire du serveur on utilise un stream
    var villeStream = Ville.find({}).cursor();
    
    villeStream.on('data',function(vi){
        graph.addNode(vi._id,{nom : vi.nom,longitude : vi.longitude,latitude : vi.latitude})
    })

    //une fois qu'on a rajouté tous les noeuds du graph, on ajoute les liens
    villeStream.on('end',  function(){
        var trStream = Troncon.find({}).cursor();
        trStream.on('data',async function(tr){
            await graph.addLink(tr.ville1, tr.ville2,
                {
                    longueur : tr.longueur,
                    vitesse: tr.vitesseMax,
                    id_tr : tr._id,
                    radar : tr.radar,
                    peage : tr.peage
                });
            await graph.addLink(tr.ville2, tr.ville1,
                {
                    longueur : tr.longueur,
                    vitesse: tr.vitesseMax,
                    id_tr : tr._id,
                    radar : tr.radar,
                    peage : tr.peage
                });
        })
        return new Promise((resolve, reject) => {
            trStream.on('end', () =>
            {
                global.graph = graph;
                resolve();
            });
            trStream.on('error', reject);
        });
    })
}



// A FAIRE
// const importMapData = require('generator.js');
// await importMapData(xmlUrl);
// console.log('IMPORT TERMINE');
// server.start();