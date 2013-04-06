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
      res.render('races', {
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
  res.render('raceedit', {
    title: 'Early Bird Race - Create a New Race',
    race: racedata.emptyRace()
  });
};

// POST race submitting.
exports.submit = function(req, res) {
  var raceObj = {};
  raceObj.title = req.body.title;
  raceObj.description = req.body.description;
  if (req.body._id) {
    raceObj._id = req.body._id;
  }
  raceObj.status = 'active';
  racedata.save(raceObj, function (err, _id) {
    if (err) {
      res.render('error', {
        title: 'Internal Error',
        error: err
      });
    }
    else {
      res.redirect('/raceview?_id=' + _id);
    }
  });
};

// GET race viewing.
exports.view = function(req, res) {
  var _id = req.query['_id'];
  console.log(_id);
  racedata.find({
    _id: _id
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
  var _id = req.query['_id'];
  console.log(_id);
  racedata.find({
    _id: _id
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

// GET race deleting.
exports.delete = function (req, res) {
  var _id = req.query['_id'];
  racedata.remove({
    _id: _id
  }, function (err) {
    if (err) {
      res.render('error', {
        title: 'Internal Error',
        error: err
      });
    }
    else {
      res.redirect('/');
    }
  });
};
