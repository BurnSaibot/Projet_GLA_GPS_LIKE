var createError = require('http-errors');
var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');
var mongoose = require('mongoose');
var _ = require('./controllers/utils');
var mapURL = process.argv[2];
const importMapData = require('./controllers/generator').initDB;
const initGraph = require('./controllers/generator').initGraph;
//var generateMap = require('./controllers/generator');
var routes = require('./route.js');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//initialisation d'un secret de session
app.use(session({secret: 'GPS-LIKE\'s secret',saveUninitialized: false, resave: true, cookie: { secure: false }}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//=====DBConnection=====
mongoose.connect("mongodb://localhost:27017/GPS_LIKE", { useNewUrlParser: true }, function(err){
  if (err) throw err;
});

var initializeServer = async function (){
  console.log(mapURL);
  if (mapURL !== undefined) {
    await importMapData(mapURL);
    console.log('Import terminé');
  }
  await initGraph();
  console.log('Graph initialisé : ');
  routes.initialize(app);
  http.createServer(app).listen(app.get('port'), function () {
	  console.log('Express server listening on port ' + app.get('port'));
  });
}
// error handler
/*app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send err
  _.response.sendError(res,err,500);
});*/
//generateMap(mapURL);
initializeServer();

