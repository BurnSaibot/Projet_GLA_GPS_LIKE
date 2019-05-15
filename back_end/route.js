var authentication = require("./controllers/authentication");
var user = require("./controllers/user.js");
var itineraire = require("./controllers/itineraire.js");
//var option = require("./controllers/option.js");
//var route = require ("./controllers/route.js");
//var troncon = require ("./controllers/troncon.js");
//var vehicule = require ("./controllers/vehicule.js");
//var ville = require ("./controllers/ville.js");
var _ = require("./controllers/utils");

//
exports.initialize = function (app) {
    
app.get("/", function (req,res,next){_.response.sendSuccess(res,"On a bien les trucs du serveur");})
.get("/login", authentication.login)
.get("/logout", authentication.logout)
.post("/inscription", user.create)

//we should add routes when needed, dont forget that we can GET/POST/PUT/DELETE for get/create/updt/delete

};