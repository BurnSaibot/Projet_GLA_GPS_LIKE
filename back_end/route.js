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
.get('/login', authentication.login())
.get('/logout', authentication.login())
//we should add routes when needed, dont forget that we can GET/POST/PUT/DELETE for get/create/updt/delete

};