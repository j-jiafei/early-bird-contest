// Definitions of behaviors of Race.

var mongoose = require('mongoose');

// Definition of Race.racelist
exports.racelist = function (statusFlag, callback) {
  var Race = mongoose.model('Race');
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
