// Definitions of behaviors of Race.

var mongoose = require('mongoose');
var Race = mongoose.model('Race');

// Definition of Race.list
exports.list = function (statusFlag, callback) {
  Race.find({'status': statusFlag}, function (err, races) {
    if (err) {
      console.log(err);
      callback(err, null);
    }
    else {
      console.log(races);
      callback(null, races);
    }
  }); // end of Race.find
}; // end of exports.racelist

// Definition of Race.save
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
}; // end of exports.racesave

// Definition of Race.find
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
}
