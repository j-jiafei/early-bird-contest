var userModel = require('../models/user');
var constants = require('../helpers/constants');
var userHelper = require('../helpers/user-helper');

/*
 * GET login
 */
exports.login = function(req, res) {
  var currentUser = userHelper.getCurrentUser(req);
  res.render('login', {
    title: 'Login'
    , email: currentUser.email
  });
};

/// GET logout
exports.logout = function (req, res) {
  req.session = null;
  res.redirect('/');
};

/*
 * POST login-submit
 */
exports.loginSubmit = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  userModel.authenticate(email, password, function(err, user) {
    if (err) {
      res.redirect('/login?err-msg=' + err);
    }
    else {
      req.session.email = email;
      res.redirect('/');
    }
  });
};

/*
 * GET '/signup'
 */
exports.signup = function(req, res) {
  var currentUser = userHelper.getCurrentUser(req);
  res.render('signup', {
    title: 'Sign up'
    , email: currentUser.email
  });
};

// POST '/signup-submit'
exports.signupSubmit = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  userModel.register(email, password, function(err) {
    if (err) {
      res.redirect('/signup?err-msg=' + err);
    }
    else {
      req.session.email = email;
      res.redirect('/');
    }
  });
};
