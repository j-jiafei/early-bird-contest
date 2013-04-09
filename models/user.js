var md5 = require('./password');
var mongoose = require('mongoose');
var User = mongoose.model('User');

// callback(err, err_no)
// err_no:
//   0: successfully
//   1: email address exists
//   2: database error
exports.create = function(email, password, callback) {
  User.find({
    email: email
  }, function(err, users) {
    if (err) {
      console.log(err);
      callback(err, 2);
    }
    else if (users && users.length > 0) {
      if (users.length > 1) {
        err = '[Internal Error] Email address should be unique';
        callback(err, 2);
      }
      else {
        err = 'Email address already exists';
        callback(null, 1);
      }
    }
    else {
      hashedPassword = md5.hash(password);
      var user = new User({
        email: email,
        password: hashedPassword
      });
      user.save(function(err, user) {
        if (err) {
          console.log(err);
          callback(err, 2);
        }
        else {
          callback(null, 0);
        }
      });
    }
  });
};

// callback(err, err_no)
// err_no:
//  0: successfully
//  1: incorrect password
//  2: user does not exists
//  3: database error
exports.validate = function(email, password, callback) {
  console.log('email: ' + email);
  console.log('password: ' + password);
  User.find({
    email: email
  }, function(err, users) {
    console.log(users);
    if (err) {
      console.log(err);
      callback(err, 3);
    }
    else if (users && users.length > 0) {
      if (users.length > 1) {
        err = '[Internal Error] Email address should be unique';
        callback(err, 3);
      }
      else {
        if (md5.validate(users[0].password, password)) {
          callback(null, 0);
        }
        else {
          err = 'Incorrect password';
          callback(err, 1);
        }
      }
    }
    else {
      err = 'The email address does not exist';
      callback(err, 2);
    }
  });
};

// Definition of User.changePassword
// Check old hashed password first, and set the new hashed password
exports.changePassword = function (email, oldHashedPassword, newHashedPassword, callback) {
};
