
/*
 * GET home page.
 */

exports.index = function(req, res){
  var racedata = require('../models/race');
  racedata.racelist('active', function (err, races) {
    if (err) {
      console.log(err);
      res.render('error', {
        error: err
      });
    }
    else {
      res.render('index', {
        title: 'Early Bird Race',
        races: races,
        raceFilterFlag: 'active'
      });
    }
  }); // end of racedata.racelist
};
