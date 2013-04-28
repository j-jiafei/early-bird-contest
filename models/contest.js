var mongoose = require('mongoose');
var assert = require('assert');
var errorMessage = require('../helpers/error-message');
var contestHelper = require('../helpers/contest-helper');

var contestSchema = new mongoose.Schema({
  title: String
  , 'from-date': String
  , 'to-date': String
  , featured: Boolean
  , repeat: String
  , description: String
  , status: String
  , participants: [String] // participants
});

var Contest = mongoose.model('Contest', contestSchema);

exports.findByTitle = function (title, callback) {
  Contest.findOne({ title: title }, function (err, contest) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, contest);
  });
};

exports.findAll = function (callback) {
  Contest.find({}, function (err, contests) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, contests);
  });
};

exports.removeByTitle = function (title, callback) {
  Contest.remove({ title: title }, function (err) {
    callback(err);
  });
};

exports.newContest = function (title, info, callback) {
  if (!contestHelper.isContestTitleValid(title)) {
    callback(new Error(errorMessage.contestTitleInvalidError));
    return;
  }
  Contest.findOne({ title: title }, function (err, contest) {
    if (err) {
      callback(err);
      return;
    }
    if (contest) {
      callback(new Error(errorMessage.contestTitleAlreadyExistsError));
      return;
    }
    if (info.title) {
      assert.equal(title, info.title);
    }
    else {
      info.title = title;
    }
    contest = new Contest(info);
    contest.save(function (err, contest) {
      if (err) {
        callback(err);
        return;
      }
      callback(null, contest);
    });
  });
};

exports.list = function (statusFlag, callback) {
  Contest.find({'status': statusFlag}, function (err, contests) {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, contests);
  });
};

exports.save = function (contestObj, callback) {
  var contest = new Contest(contestObj);
  var upsertData = contest.toObject();
  delete upsertData._id;
  Contest.update({_id: contest._id}, upsertData, {upsert: true}, function (err) {
    if (err) {
      console.log(err);
      // 0 means invalid object id
      callback(err, 0);
    }
    else {
      var _id = contest._id
      callback(null, _id);
    }
  });
}; // end of exports.save

find = exports.find = function (filter, callback) {
  if (!filter._id) {
    callback('invalid _id', null);
  }
  else {
    if ('_id' in filter) {
      filter['_id'] = mongoose.Types.ObjectId(filter['_id']);
    }
    Contest.find(filter, function (err, contests) {
      if (err) {
        console.log(err);
        callback(err, null);
      }
      else {
        console.log(contests);
        callback(null, contests);
      }
    });
  }
}; // end of exports.find

// Definition of Contest.emptyContest
exports.emptyContest = function (callback) {
  var contestObj = {
    _id: '',
    title: '',
    description: '',
    status: '',
  };
  return contestObj;
};

// Definition of Contest.remove
exports.remove = function (filter, callback) {
  if ('_id' in filter) {
    filter['_id'] = mongoose.Types.ObjectId(filter['_id']);
  }
  Contest.remove(filter, function (err) {
    if (err) {
      console.log(err);
      callback(err);
    }
    else {
      callback(null);
    }
  }); // end of Contest.remove
}; // end of exports.remove

/// @param callback - callback (error)
exports.addParticipant = function (contestObjectID, userObjectID, callback) {
  Contest.findById(contestObjectID, function (error, contest) {
    if (error) {
      callback(error);
      return;
    }
    contest.participants.push(userObjectID);
    contest.save(function (err, contest) {
      if (err) {
        console.log(err);
        callback(err);
        return;
      }
      callback(null);
    });
  });
};
