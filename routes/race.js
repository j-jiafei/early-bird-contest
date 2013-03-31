var racedata = require('../models/race');

// GET races listing.
exports.list = function(req, res) {
  var raceFilterFlag = 'all';
  racedata.list(raceFilterFlag, function (err, races) {
    if (err) {
      req.render('error', err);
    }
    else {
      res.render('racelist', {
        title: 'Early Bird Race - Create a New Race',
        raceFilterFlag: raceFilterFlag,
        races: races
      });
    }
  });
};

// GET race creating.
// Display the new race form.
exports.create = function(req, res) {
  res.render('racecreate', {
    title: 'Early Bird Race - Create a New Race'
  });
};

// POST race submitting.
exports.submit = function(req, res) {
  var title = req.body.title;
  var desc = req.body.desc;
  racedata.save({
    title: title,
    desc: desc
  });
  res.redirect('/raceview?');
};

// GET race viewing.
exports.view = function(req, res) {
  res.send('View the race');
};
