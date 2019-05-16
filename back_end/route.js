var authentication = require('./controllers/Authentication');
var user = require('./controllers/user.js');
var itineraire = require('./controllers/itineraire.js');
var option = require('./controllers/option.js');
var route = require ('./controllers/route.js');
var troncon = require ('./controllers/troncon.js');
var vehicule = require ('./controllers/vehicule.js');
var ville = require ('./controllers/ville.js');

//
exports.initialize = function (app) {
    
app.get('/', function(req,res,next) {})
.get('/login', authentication.login)
.get('/logout', authentication.logout)
.post('/inscription', user.create)



.get('/vehicule', vehicule.listeVehicule)
.get('/vehicule/:id', vehicule.detailVehicule)
.post('/vehicule', vehicule.createVehicule)
.post('/vehicule/:id/updtAge', vehicule.updtAge)
.post('/vehicule/:id/updtEtat', vehicule.updtEtat)
.post('/vehicule/:id/delete', vehicule.supprimerVehicule)

.get('/option', option.defaut)
.post('/option', option.updtOption)

.get('/ville', ville.listeVilles)
.post('/ville', ville.createVille)
.get('/ville/:id', ville.infoVille)
.post('/ville/:id/updt', ville.updtVille)
.post('/ville/:id/delete', ville.supprimerVille)

.get('/route',route.listeRoutes)
.post('/route', route.createRoute)
.get('/route/:id', route.infoRoute)
.post('/route/:id/updt', route.updtRoute)
.post('/route/:id/delete', route.supprimerRoute)

.get('/troncon',troncon.listeTroncon)
.post('/troncon', troncon.createTroncon)
.get('/troncon/:id', troncon.infoTroncon)
.post('/troncon/:id/updt', troncon.updtTroncon)
.post('/troncon/:id/delete', troncon.supprimerTroncon)

//we should add routes when needed, dont forget that we can GET/POST/PUT/DELETE for get/create/updt/delete

};