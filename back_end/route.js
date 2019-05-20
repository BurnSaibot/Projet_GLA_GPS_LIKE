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

.get("/logout", authentication.middleware.isLoggedIn, authentication.logout)


.get('/vehicule', authentication.middleware.isLoggedIn, vehicule.listeVehicule)
.get('/vehicule/:id', authentication.middleware.isLoggedIn, vehicule.detailVehicule)
.post('/vehicule', authentication.middleware.isLoggedIn, vehicule.createVehicule)
.put('/vehicule/:id', authentication.middleware.isLoggedIn, vehicule.updt)
.delete('/vehicule/:id', authentication.middleware.isLoggedIn, vehicule.supprimerVehicule)

.put('/option', authentication.middleware.isLoggedIn, option.updtOption)

.get('/ville', authentication.middleware.isLoggedIn, ville.listeVilles)
.post('/ville', authentication.middleware.isLoggedIn, ville.createVille)
.get('/ville/:id', authentication.middleware.isLoggedIn, ville.infoVille)
.put('/ville/:id', authentication.middleware.isLoggedIn, ville.updtVille)
.delete('/ville/:id', authentication.middleware.isLoggedIn, ville.supprimerVille)

.get('/route', authentication.middleware.isLoggedIn,route.listeRoutes)
.post('/route', authentication.middleware.isLoggedIn, route.createRoute)
.get('/route/:id', authentication.middleware.isLoggedIn, route.infoRoute)
.put('/route/:id', authentication.middleware.isLoggedIn, route.updtRoute)
.delete('/route/:id', authentication.middleware.isLoggedIn, route.supprimerRoute)

.get('/troncon', authentication.middleware.isLoggedIn,troncon.listeTroncon)
.post('/troncon', authentication.middleware.isLoggedIn, troncon.createTroncon)
.get('/troncon/:id', authentication.middleware.isLoggedIn, troncon.infoTroncon)
.put('/troncon/:id', authentication.middleware.isLoggedIn, troncon.updtTroncon)
.delete('/troncon/:id', authentication.middleware.isLoggedIn, troncon.supprimerTroncon)

//we should add routes when needed, dont forget that we can GET/POST/PUT/DELETE for get/create/updt/delete

};