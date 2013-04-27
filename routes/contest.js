/// \brief route User related methods.
/// \author Jeff Jia

var contestData = require('../models/contest');
var userModel = require('../models/user');
var userHelper = require('../helpers/user-helper');

/// local functions for exports.list
var createTab = function (name, filterFlag, active) {
  return {
    name: name
    , filterFlag: filterFlag
    , active: active
  };
}

// GET '/contests'
exports.list = function (req, res) {
  var filterFlag = req.query['tab'];
  var currentUser = userHelper.getCurrentUser(req);
  var tabs = new Array();
  tabs[0] = createTab('Subscribed', 'subscribed', false);
  tabs[1] = createTab('Featured', 'featured', false);
  tabs[2] = createTab('All', 'all', false);
  var foundActive = false;
  for (var i = 0; i < tabs.length; ++i) {
    if (tabs[i].filterFlag == filterFlag) {
      tabs[i].active = true;
      foundActive = true;
    }
  }
  if (!foundActive) {
    tabs[0].active = true;
  }
  raceModel.list('all', function (err, races) {
    if (err) {
      req.render('error', {
        title: '[Internal Error]',
        error: err
      });
    }
    else {
      res.render('contests', {
        title: 'Early Bird Contests - Contest List'
        , races: races
        , email: currentUser.email
        , tabs: tabs
      });
    }
  });
};

// GET '/contest/new'
exports.new = function (req, res) {
  var currentUser = userHelper.getCurrentUser(req);
  if (!currentUser.email) {
    // login first
    res.redirect('/login');
  }
  res.render('new-contest', {
    title: 'Early Bird Contests - Submit a New Contest'
    , email: currentUser.email
  });
};

// POST '/contest/new-submit'
exports.newSubmit = function (req, res) {
  var currentUser = userHelper.getCurrentUser(req);
  if (currentUser.email && userHelper.canCreateContest(currentUser.email)) {
    console.log(req.body);
    contestData.newContest(req.body['title'], {
      'from-date': req.body['from-date']
      , 'to-date': req.body['to-date']
      , repeat: req.body['repeat']
      , featured: req.body['featured']
      , description: req.body['description']
    }, function (err, contest) {
      if (err) {
        console.log(err);
        res.redirect('/contest/new?err=' + err.message);
        return;
      }
      res.redirect('/management');
    });
  }
  else {
    // the user cannot create a contest
    res.redirect('/login');
  }
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
  raceModel.save(raceObj, function (err, _id) {
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
  var currentUser = userHelper.getCurrentUser(req);
  console.log(_id);
  raceModel.find({
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
        title: 'Early Bird Race'
        , race: races[0]
        , email: currentUser.email
      });
    }
  });
};

// GET race editing.
exports.edit = function(req, res) {
  var _id = req.query['_id'];
  var currentUser = userHelper.getCurrentUser(req);
  console.log(_id);
  raceModel.find({
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
        title: 'Early Bird Race - Edit a Race'
        , race: races[0]
        , email: currentUser.email
      });
    }
  }); // end of raceModel.find
};

// GET race deleting.
exports.delete = function (req, res) {
  var _id = req.query['_id'];
  raceModel.remove({
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

/// GET '/race-subscribe'
exports.subscribe = function (req, res) {
  var raceId = req.query['raceId'];
  var currentUser = userHelper.getCurrentUser(req);
  var currentUserId = currentUser.id;
  if (currentUserId) {
    raceModel.addParticipant(raceId, currentUserId
        , function (err) {
      if (err) {
        console.log(err);
        res.end(err);
        return;
      }
      console.log('[Info] Add participant successfully.');
      userModel.addRace(currentUserId, raceId, function (err) {
        if (err) {
          console.log(err);
          res.end('Error: ' + err);
          return;
        }
        console.log('[Info] Add race successfully.');
        res.redirect('/races');
      });
    });
  }
  else {
    // The user needs to sign in.
    res.redirect('/login');
  }
};
