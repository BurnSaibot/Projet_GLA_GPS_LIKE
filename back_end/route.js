var authentication = require("./controllers/authentication");
var user = require("./controllers/user.js");
var itineraire = require("./controllers/itineraire.js");
var option = require("./controllers/option.js");
var route = require ("./controllers/route.js");
var troncon = require ("./controllers/troncon.js");
var vehicule = require ("./controllers/vehicule.js");
var ville = require ("./controllers/ville.js");
var _ = require("./controllers/utils");

//
exports.initialize = function (app) {
    
app.get("/", function (req,res,next){_.response.sendSuccess(res,"On a bien les trucs du serveur");})
.post("/inscription", user.create)

.post("/login", authentication.login)

.get("/logout", authentication.logout)


.get('/vehicule', vehicule.listeVehicule)
.get('/vehicule/:id', vehicule.detailVehicule)
.post('/vehicule', vehicule.createVehicule)
.put('/vehicule/:id', vehicule.updt)
.delete('/vehicule/:id', vehicule.supprimerVehicule)

.post('/option', option.defaut)
.put('/option', option.updtOption)

.get('/ville', ville.listeVilles)
.post('/ville', ville.createVille)
.get('/ville/:id', ville.infoVille)
.put('/ville/:id', ville.updtVille)
.delete('/ville/:id', ville.supprimerVille)

.get('/route',route.listeRoutes)
.post('/route', route.createRoute)
.get('/route/:id', route.infoRoute)
.put('/route/:id', route.updtRoute)
.delete('/route/:id', route.supprimerRoute)

.get('/troncon',troncon.listeTroncon)
.post('/troncon', troncon.createTroncon)
.get('/troncon/:id', troncon.infoTroncon)
.put('/troncon/:id', troncon.updtTroncon)
.delete('/troncon/:id', troncon.supprimerTroncon)

//we should add routes when needed, dont forget that we can GET/POST/PUT/DELETE for get/create/updt/delete

};