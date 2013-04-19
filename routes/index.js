/// route '/'
/// \author Jeff Jia

var userHelper = require('./helpers/user-helper');
var raceData = require('../models/race');

// GET '/'
exports.index = function(req, res){
  var currentUser = userHelper.getCurrentUser(req);
  if (currentUser.email) {
    // Display home page for logged user
    res.render('home', {
      title: 'Early Bird Contest'
      , email: currentUser.email
    });
  }
  else {
    // Display market index page for new user
    res.render('index', {
      title: 'Early Bird Contest'
      , email: currentUser.email
    });
  }
};
