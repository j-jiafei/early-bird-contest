/// route '/'
/// \author Jeff Jia

var userHelper = require('./helpers/user-helper');
var raceData = require('../models/race');

/// GET '/'
exports.index = function(req, res){
  var currentUser = userHelper.getCurrentUser(req);
  raceData.list('active', function (err, races) {
    if (err) {
      console.log(err);
      res.render('error', {
        error: err
      });
    }
    else {
      res.render('index', {
        title: 'Early Bird Race'
        , races: races
        , raceFilterFlag: 'active'
        , logged: req.session.logged
        , email: currentUser.email
      });
    }
  }); // end of racedata.racelist
};
