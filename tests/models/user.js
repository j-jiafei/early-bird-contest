/// test for userModel
/// \author Jeff Jia

var testConstants = require('../test-constants');
var assert = require('assert');
var userModel = require('../../models/user');
var mongoose = require('mongoose');
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
    var registeredUsers = [
      {
        email: 'bob@gmail.com'
        , password: 'bob_password'
      }
      , {
        email: 'david@gmail.com'
        , password: 'david_password'
      }
    ];
    /// add two users bob and david into the db.
    beforeEach(function (done) {
      userModel.create(registeredUsers[0].email, registeredUsers[0].password,
        function (err) {
          if (err) {
            done(err);
            return;
          }
          userModel.create(registeredUsers[1].email, registeredUsers[1].email,
            function (err) {
              if (err) {
                done(err);
                return;
              }
              done();
            }
          );
        }
      );
    });
    it('registered users should be found', function (done) {
      userModel.findByEmail(registeredUsers[0].email, function (err, u) {
        if (err) {
          done(err);
          return;
        }
        assert.notEqual(null, u);
        assert.equal(registeredUsers[0].email, u.email);
        userModel.findByEmail(registeredUsers[1].email, function (err, u) {
          if (err) {
            done(err);
          }
          assert.notEqual(null, u);
          assert.equal(registeredUsers[1].email, u.email);
          done();
        });
      });
    });
    it('frank should not be found');
  });
});
