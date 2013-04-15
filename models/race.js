var mongoose = require('mongoose');
var assert = require('assert');
var errorMessage = require('../routes/error-message');

var raceSchema = new mongoose.Schema({
  title: String
  , description: String
  , status: String
  , participants: [String] // participants
});

var Race = mongoose.model('Race', raceSchema);

exports.findByTitle = function (title, callback) {
  Race.findOne({ title: title }, function (err, race) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, race);
  });
};

exports.create = function (title, info, callback) {
  Race.findOne({ title: title }, function (err, race) {
    if (err) {
      callback(err);
      return;
    }
    if (race) {
      callback(new Error(errorMessage.raceTitleAlreadyExistsError));
      return;
    }
    if (info.title) {
      assert.equal(title, info.title);
    }
    else {
      info.title = title;
    }
    race = new Race(info);
    race.save(function (err, race) {
      if (err) {
        callback(err);
        return;
      }
      callback(null, race);
    });
  });
};

exports.list = function (statusFlag, callback) {
  Race.find({'status': statusFlag}, function (err, races) {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, races);
  });
};

exports.save = function (raceObj, callback) {
  var race = new Race(raceObj);
  var upsertData = race.toObject();
  delete upsertData._id;
  Race.update({_id: race._id}, upsertData, {upsert: true}, function (err) {
    if (err) {
      console.log(err);
      // 0 means invalid object id
      callback(err, 0);
    }
    else {
      var _id = race._id
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
    Race.find(filter, function (err, races) {
      if (err) {
        console.log(err);
        callback(err, null);
      }
      else {
        console.log(races);
        callback(null, races);
      }
    });
  }
}; // end of exports.find

// Definition of Race.emptyRace
exports.emptyRace = function (callback) {
  var raceObj = {
    _id: '',
    title: '',
    description: '',
    status: '',
  };
  return raceObj;
};

// Definition of Race.remove
exports.remove = function (filter, callback) {
  if ('_id' in filter) {
    filter['_id'] = mongoose.Types.ObjectId(filter['_id']);
  }
  Race.remove(filter, function (err) {
    if (err) {
      console.log(err);
      callback(err);
    }
    else {
      callback(null);
    }
  }); // end of Race.remove
}; // end of exports.remove

/// @param callback - callback (error)
exports.addParticipant = function (raceObjectID, userObjectID, callback) {
  Race.findById(raceObjectID, function (error, race) {
    if (error) {
      callback(error);
      return;
    }
    race.participants.push(userObjectID);
    race.save(function (err, race) {
      if (err) {
        console.log(err);
        callback(err);
        return;
      }
      callback(null);
    });
  });
};
