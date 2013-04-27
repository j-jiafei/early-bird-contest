var mongoose = require('mongoose');

var md5 = require('./password');
var errorMessage = require('../helpers/error-message');

var userSchema = new mongoose.Schema({
  email: String
  , nickname: String
  , password: String
  , credit: Number
  , races: [mongoose.Schema.Types.ObjectID]
});

// The collection name in mongodb is "users".
var User = mongoose.model('User', userSchema);

/// \param callback - callback (err, user)
exports.findByEmail = function (email, callback) {
  User.findOne({ email: email }, function (err, user) {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, user);
  });
};

// callback(err, user)
exports.register = function(email, password, callback) {
  User.findOne({
    email: email
  }, function(err, user) {
    if (err) {
      callback(err);
    }
    else if (user) {
      callback(new Error(errorMessage.emailAlreadyExistsError));
    }
    else {
      hashedPassword = md5.hash(password);
      var user = new User({
        email: email,
        password: hashedPassword
      });
      user.save(function(err, user) {
        if (err) {
          callback(err);
        }
        else {
          callback(null, user);
        }
      });
    }
  });
};

/// \param callback - callback(err, user)
exports.authenticate = function(email, password, callback) {
  User.findOne({
    email: email
  }, function(err, user) {
    if (err) {
      callback(err);
    }
    else if (user) {
      if (md5.validate(user.password, password)) {
        callback(null, user);
      }
      else {
        callback(new Error(errorMessage.invalidPasswordError));
      }
    }
    else {
      callback(new Error(errorMessage.nonExistentEmailError));
    }
  });
};

/// \param callback - callback(err, user)
exports.subscribeRace = function (email, raceId, callback) {
  User.findOne({ email: email }, function (err, user) {
    if (err) {
      callback(err);
      return;
    }
    if (!user) {
      callback(new Error(errorMessage.nonExistentEmailError));
      return;
    }
    if (user.races.indexOf(raceId) != -1) {
      callback(new Error(errorMessage.raceAlreadySubscribedError));
      return;
    }
    user.races.push(raceId);
    user.save(function (err, user) {
      if (err) {
        console.log(err);
        callback(err);
        return;
      }
      callback(null, user);
    });
  });
};
