var racedata = require('../models/race');

// GET races listing.
exports.list = function(req, res) {
  var raceFilterFlag = 'all';
  racedata.list(raceFilterFlag, function (err, races) {
    if (err) {
      req.render('error', {
        title: 'Internal Error',
        error: err
      });
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
    description: desc,
    status: 'active'
  }, function (err, id) {
    if (err) {
      res.render('error', {
        title: 'Internal Error',
        error: err
      });
    }
    else {
      res.redirect('/raceview?id=' + id);
    }
  });
};

// GET race viewing.
exports.view = function(req, res) {
  var id = req.query['id'];
  console.log(id);
  racedata.find({
    _id: id
  }, function (err, races) {
    if (err || races.length < 1) {
      res.render('error', {
        title: 'Internal Error',
        error: err
      });
    }
    else {
      res.render('raceview', {
        title: 'Early Bird Race',
        race: races[0]
      });
    }
  });
};

// GET race editing.
exports.edit = function(req, res) {
  var id = req.query['id'];
  console.log(id);
  racedata.find({
    _id: id
  }, function (err, races) {
    if (err || races.length < 1) {
      res.render('error', {
        title: 'Internal Error',
        error: err
      });
    }
    else {
      res.render('raceedit', {
        title: 'Early Bird Race - Edit a Race',
        race: races[0]
      });
    }
  }); // end of racedata.find
};
