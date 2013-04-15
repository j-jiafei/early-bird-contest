var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ebr_dev', function (err) {
  if (err) {
    throw err;
  }
});
