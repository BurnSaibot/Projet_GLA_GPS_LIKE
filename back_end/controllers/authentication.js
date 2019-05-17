var crypto = require('crypto');
var _ = require('./Utils.js');
var User = require('../models/user.js').user;

const KEYLEN = 128;
const ITERATIONS = 12000;

exports.helper = {};

// Get password hash using provided salt
var getHash = function (password, salt, callback) {
    // password: user password
    // salt: user salt
    // callback: function (error, hash)
    try {
      crypto.pbkdf2(password, salt, ITERATIONS, KEYLEN,"sha512", function (error, buffer) {
        var hash = buffer.toString('base64');
        callback(error, hash);
      });
    } catch (error) {
      callback(error);
    }
  
  };
  
  // Get password hash using random salt
  exports.helper.generateSaltAndHash = function (password, callback) {
    // password: user password
    // callback: function (error, salt, hash)
    
    crypto.randomBytes(KEYLEN, function (error, buffer) {
      if (error) {
        
        callback(error);
      } else {
        var salt = buffer.toString('base64');
        getHash(password, salt, function (error, hash) {
          callback(error, salt, hash);
        });
      }
    });
  };

  exports.middleware = {};

// user is logged in?
exports.middleware.isLoggedIn = function (req, res, next) {
  if (!req.session.user) {
    _.response.sendError(res, 'Access denied.', 401);
    return;
  }
  next();
};

// Login
exports.login = function (req, res) {
    var failure = 'Authentication failed (check your mail and password).';
    // check that both mail and password are defined
    if (req.body.mail === undefined ||
      req.body.password === undefined) {
      _.response.sendError(res, failure, 401);
      return;
    }
  
    // find user by its name
    User.findOne({
      mail: req.body.mail
    }, function (error, user) {
  
      // if error or user does not exist, report authentication failure
      if (error || !user) {
        _.response.sendError(res, failure, 401);
        return;
      }
  
      // generate hash from password and salt and compare it to stored hash
      getHash(req.body.password, user.salt, function (error, hash) {
  
        if (error || user.hash !== hash) {
          _.response.sendError(res, failure, 401);
          return;
        }
  
        // if hash is correct, success!
        req.session.regenerate(function () {
          req.session.user = user;
          _.response.sendSuccess(res, 'Authentication succeeded.');
          return;
        });
  
      });
  
    });
  };

  // logout
exports.logout = function (req, res) {
    req.session.destroy(
      _.response.sendSuccess(res, 'Logout succeeded.'));
};
  
exports.me = function (req, res) {
    var user = req.session.user;
    res.status(200)
        .json({
            _id: user._id,
            mail: user.mail,
            name: user.prenom,
            surname: user.nom
        });
};