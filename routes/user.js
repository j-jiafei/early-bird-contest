var userdata = require('../models/user');
var constants = require('./constants');
var userHelper = require('./helpers/user-helper');

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
exports.login_submit = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  userdata.validate(email, password, function(err, err_no, user) {
    if (err) {
      console.log(err);
    }
    switch (err_no) {
      case 0:
        // authentication successfully
        req.session.email = email;
        if (req.body.remember) {
          // TODO - I have not sure how to set maxAge in cookieSession.
          // I guess we need a separate cookie to deal with this case.
        }
        res.redirect('/');
        break;
      case 1:
        res.redirect('/login?err_no=1');
        break;
      case 2:
        res.redirect('/login?err_no=2');
        break;
      case 3:
        res.redirect('/login?err_no=3');
        break;
      default:
        console.error('[Error] Undefined behavior');
        res.redirect('/login?err_no=3');
        break;
    }
  });
};

/*
 * GET signup
 */
exports.signup = function(req, res) {
  var currentUser = userHelper.getCurrentUser(req);
  res.render('signup', {
    title: 'Sign up'
    , email: currentUser.email
  });
};

/*
 * POST signup-submit
 */
exports.signup_submit = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  userdata.create(email, password, function(err, err_no) {
    if (err) {
      res.redirect('/signup?error_no=2');
    }
    else {
      switch (err_no) {
        case 0:
          res.redirect('/');
          break;
        case 1:
          res.redirect('/login?error_no=1');
          break;
        case 2:
          res.redirect('/signup?error_no=2');
          break;
        default:
          console.error('[Error] Undefined behavior');
          res.redirect('/signup?error_no=2');
          break;
      }
    }
  });
};
