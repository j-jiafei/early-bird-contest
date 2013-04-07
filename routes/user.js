/*
 * GET login
 */
exports.login = function(req, res) {
  res.render('login', {
    title: 'Login'
  });
};

/*
 * GET register
 */
exports.signup = function(req, res) {
  res.render('signup', {
    title: 'Sign up'
  });
};
