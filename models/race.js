// Definitions of behaviors of Race.

var mongoose = require('mongoose');
var Race = mongoose.model('Race');

// Definition of Race.list
exports.list = function (statusFlag, callback) {
  Race.find({'StatusFlag': statusFlag}, function (err, races) {
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
  race.save(function (err) {
    if (err) {
      console.log(err);
    }
  });
}; // end of exports.racesave
