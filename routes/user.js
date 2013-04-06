/*
 * GET login
 */
exports.login = function(req, res) {
  res.render('login', {
    title: 'login'
  });
};

/*
 * GET register
 */
exports.register = function(req, res) {
  res.render('register', {
    title: 'register'
  });
};
