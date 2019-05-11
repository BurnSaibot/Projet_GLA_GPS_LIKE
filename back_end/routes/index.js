var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = require('../models/user').user;
mongoose.connect('mongodb://localhost:27017/projet_gps', { useNewUrlParser: true });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'GPS' });
});

/* inscrire */

router.route('/inscrire').get(function(req, res) {
  res.render('inscrire', { title: 'inscrire' });
});
router.post(('/register'), function(req, res) {
  var password=req.body.password;
  var nom=req.body.nom;
  var prenom=req.body.prenom;
  var mail = req.body.mail;
	
	user.findOne({mail:mail},function(err,result){
		if(err){
			console.log(err);
		}
		else if(result){
      console.log("compte existe");
      res.render('inscrire', { title: 'login' });
		}
		else{
			user.create({
				mail:mail,
        password:password,
        nom:nom,
        prenom:prenom
			},function(err,doc){
				if(err){
					console.log(err);
				}
				else{
          console.log("compte est cree");
          res.render('register', { title: 'register' });
				}
			})
		}
	});
});



/* login */
router.get('/login',function(req, res) {
  res.render('login', {title: 'login'});
});

/*logout*/
router.get('/logout', function(req, res) {
  res.render('logout', { title: 'logout' });
});

/* hompage */
router.post('/homepage', function(req, res) {
var query_doc = {mail: req.body.mail, password: req.body.password};
(function(){
    user.count(query_doc, function(err, doc){
        if(doc == 1){
            console.log(query_doc.userid + ": login success in " + new Date());
            res.render('homepage', { title: 'homepage' });
        }else{
            console.log(query_doc.userid + ": login failed in " + new Date());
            res.redirect('login');
        }
    });
  })(query_doc);
});




module.exports = router;
