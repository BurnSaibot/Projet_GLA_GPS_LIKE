var createXmlStream = require('xml-flow');
var { createReadStream } = require('fs');

var Route = require('../models/route').route;
var Troncon = require('../models/troncon').troncon;
var Ville = require('../models/ville').ville;

// Store ids associated to names (hopefully unique ?)
const citiesCache = {};

async function cleaupDatabase() {
    await Ville.remove({})
    await Troncon.remove({});
    await Route.remove({});
    return true;
}

function importCities(url) {
    const dataStream = createReadStream(url);
    const xmlStream = createXmlStream(dataStream);
    xmlStream.on('tag:ville', async function(v) {
        
        const city = await Ville.create({
            nom: v.nom,
            taille: v.type,
            touristique: v.touristique === 'oui'
        })
        citiesCache[city.nom] = city._id;
        xmlStream.resume();
    });

    return new Promise((resolve, reject) => {
        xmlStream.on('end', resolve);
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

module.exports = async function(url) {
    await cleaupDatabase();
    await importCities(url);
    console.log()
    await importRoutesAndSections(url);
}

// A FAIRE
// const importMapData = require('generator.js');
// await importMapData(xmlUrl);
// console.log('IMPORT TERMINE');
// server.start();