/// route '/'
/// \author Jeff Jia

var userHelper = require('../helpers/user-helper');
var contestData = require('../models/contest');

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

// GET '/public-activity'
exports.publicActivity = function (req, res) {
  var currentUser = userHelper.getCurrentUser(req);
  res.render('public-activity', {
    title: 'Public Activity'
    , email: currentUser.email
  });
};

// GET '/management'
exports.management = function (req, res) {
  var currentUser = userHelper.getCurrentUser(req);
  contestData.findAll(function (err, contests) {
    res.render('management', {
      title: 'Management'
      , email: currentUser.email
      , contests: contests
    });
  });
};

// GET '/explore'
exports.explore = function (req, res) {
  var currentUser = userHelper.getCurrentUser(req);
  contestData.findAll(function (err, contests) {
    res.render('explore', {
      title: 'Explore'
      , email: currentUser.email
      , contests: contests
    });
  });
};

// GET '/features'
exports.features = function (req, res) {
  var currentUser = userHelper.getCurrentUser(req);
  res.render('features', {
    title: 'Features'
    , email: currentUser.email
  });
};

// GET '/blog'
exports.blog = function (req, res) {
  var currentUser = userHelper.getCurrentUser(req);
  res.render('blog', {
    title: 'Blog'
    , email: currentUser.email
  });
};

// GET '/help'
exports.help = function (req, res) {
  var currentUser = userHelper.getCurrentUser(req);
  res.render('help', {
    title: 'Help'
    , email: currentUser.email
  });
};
