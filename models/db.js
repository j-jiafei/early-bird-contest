// Definitions of model schemas and models, and connection to mongodb.

var mongoose = require('mongoose');

// The schema for race.
// TODO - Later shorter key names may be used to save space.
var raceSchema = new mongoose.Schema({
  title: String, // race title
  description: String, // race description
  status: String // race status
  // creator
  // created_at
  // participants?
});

// The definition of class Race.
// The collection name in mongodb is races due to the "smart" tricks of
// mongoose.
var Race = mongoose.model('Race', raceSchema);

// The schema for user.
// TODO - Later shorter key names may be used to save space.
var userSchema = new mongoose.Schema({
  email: String, // user email
  nickname: String, // user nickname, since users may not mean to expose emails
  password: String, // user hashed password
  credit: Number // user credit
  // introduction
  // created_at
  // participating races?
});

// The definition of class User.
// The collection name in mongodb is users.
var User = mongoose.model('User', userSchema);

// earlybirdracedev is the mongodb database name for "dev".
// An exception is thrown if the connection fails.
mongoose.connect('mongodb://localhost/earlybirdracedev', function (err) {
  if (err) {
    throw err;
  }
});

// TODO - this part of code may be deprecated, because the check may not be
// necessary.
var dbConn = mongoose.connection;
dbConn.once('Open', function () {
  console.log('Connection to mongodb is successful!');
});
