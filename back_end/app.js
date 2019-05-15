var createError = require('http-errors');
var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var routes = require('./route.js');

var app = express();

app.set('port', process.env.PORT || 3100);

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
mongoose.connect("mongodb://localhost:27017/GPS_LIKE", function(err){
  if (err) throw err;
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

routes.initialize(app);

module.exports = app;


http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});
