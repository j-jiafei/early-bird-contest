/// route '/about'
/// \author Jeff Jia

var userHelper = require('../helpers/user-helper');

/// GET '/about'
exports.about = function (req, res) {
  var currentUser = userHelper.getCurrentUser(req);
  res.render('about', {
    title: 'About'
    , email: currentUser.email
  });
};
