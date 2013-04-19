/// route '/'
/// \author Jeff Jia

var userHelper = require('./helpers/user-helper');
var raceData = require('../models/race');

// GET '/'
exports.index = function(req, res){
  var currentUser = userHelper.getCurrentUser(req);
  if (currentUser.email) {
    res.redirect('/home');
  }
  else {
    // Display market index page for new user
    res.render('index', {
      title: 'Early Bird Contest'
      , email: currentUser.email
    });
  }
};

// GET '/home'
exports.home = function (req, res) {
  var currentUser = userHelper.getCurrentUser(req);
  var tab = req.query['tab'];
  if (currentUser) {
    res.render('home', {
      title: 'Early Bird Contest'
      , email: currentUser.email
      , tab: tab
    });
  }
  else {
    res.redirect('/login');
  }
};
