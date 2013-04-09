var userdata = require('../models/user');

/*
 * GET login
 */
exports.login = function(req, res) {
  res.render('login', {
    title: 'Login'
  });
};

/*
 * POST login-submit
 */
exports.login_submit = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  userdata.validate(email, password, function(err, err_no) {
    if (err) {
      console.log(err);
    }
    switch (err_no) {
      case 0:
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
  res.render('signup', {
    title: 'Sign up'
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
