// Definitions of behaviors of User.

var mongoose = require('mongoose');
var User = mongoose.model('User');

// Definition of User.save
exports.save = function (userObj, callback) {
}; // end of exports.save

// Definition of User.check
exports.check = function (email, hashedPassword, callback) {
}; // end of exports.check

// Definition of User.changePassword
// Check old hashed password first, and set the new hashed password
exports.changePassword = function (email, oldHashedPassword, newHashedPassword, callback) {
}; // end of exports.changePassword
