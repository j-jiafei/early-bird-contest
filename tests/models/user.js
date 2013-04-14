/// test for userModel
/// \author Jeff Jia

var testConstants = require('../test-constants');
var assert = require('assert');
var userModel = require('../../models/user');
var mongoose = require('mongoose');
var async = require('async');
var User = mongoose.model('User');
mongoose.connect(testConstants.mongoDbTestUrl);

describe('userModel', function() {

  /// clear database
  beforeEach(function (done) {
    User.remove({}, done);
  });

  /// clear database
  afterEach(function (done) {
    User.remove({}, done);
  });

  describe('#create', function() {
    it('The email and hashed password are stored in the db.', function (done) {
      userModel.create('bob@gmail.com', 'bob_password', function (err, err_no) {
        if (err) {
          return done(err);
        }
        assert.equal(0, err_no);
        User.findOne({ email: 'bob@gmail.com' }, function (err, user) {
          if (err) {
            done(err);
          }
          else {
            assert.notEqual(user, null);
            // password should be hashed.
            assert.notEqual(user.password, 'bob_password');
            done();
          }
        });
      });
    });
    it('return `err, 1` when the email already exists', function (done) {
      userModel.create('bob@gmail.com', 'bob_password', function (err, err_no) {
        if (err) {
          return done(err);
        }
        userModel.create('bob@gmail.com', 'bob_password',
          function (err, err_no) {
            if (err) {
              assert.equal(err_no, 1);
              done();
            }
          });
      });
    });
  });

  describe('#findByEmail', function () {
    var registeredEmails = [
      'bob@gmail.com'
      , 'david@gmail.com'
    ];
    var nonRegisteredEmails = [
      'frank@gmail.com',
      'howard@gmail.com'
    ];
    /// add two users bob and david into the db.
    beforeEach(function (done) {
      var count = 0;
      async.each(registeredEmails,
        function (email) {
          userModel.create(email, 'password', function (err) {
            if (err) {
              done(err);
              return;
            }
            ++count;
            if (count == registeredEmails.length) {
              done();
            }
          });
        },
        function (err) {
          done(err);
          return;
        }
      );
    });
    it('registered users should be found', function (done) {
      var count = 0;
      async.each(registeredEmails,
        function (email) {
          userModel.findByEmail(email, function (err) {
            if (err) {
              done(err);
              return;
            }
            ++count;
            if (count == registeredEmails.length) {
              done();
            }
          });
        },
        function (err) {
          done(err);
          return;
        }
      );
    });
    it('non-registered users should not be found', function (done) {
      var count = 0;
      async.each(nonRegisteredEmails,
        function (email) {
          userModel.findByEmail(email, function (err) {
            if (err) {
              done(err);
              return;
            }
            ++count;
            if (count == nonRegisteredEmails.length) {
              done();
            }
          });
        },
        function (err) {
          done(err);
          return;
        }
      );
    });
  });
});
