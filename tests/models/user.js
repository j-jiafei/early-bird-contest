/// test for userModel
/// \author Jeff Jia

var errorMessage = require('../../routes/error-message');
var testConstants = require('../test-constants');
var userModel = require('../../models/user');


var assert = require('assert');
var mongoose = require('mongoose');
var async = require('async');

var User = mongoose.model('User');
mongoose.connect(testConstants.mongoDbTestUrl);

describe('userModel', function() {

  /// clear database
  /// add some test users
  beforeEach(function (done) {
    async.series([
      function (callback) {
        User.remove({}, callback);
      }
      , function (callback) {
        userModel.register('test1@gmail.com', 'pw_test1', callback);
      }
      , function (callback) {
        userModel.subscribeRace('test1@gmail.com', 1, callback);
      }
    ], function (err) {
      if (err) {
        done(err);
        return;
      }
      done();
    });
  });

  /// clear database
  afterEach(function (done) {
    User.remove({}, done);
  });

  describe('.register', function() {
    it('The email and hashed password are stored in the db.', function (done) {
      userModel.register('test2@gmail.com', 'pw_test2',
        function (err, user) {
          if (err) {
            done(err);
          }
          else {
            assert.equal(user.email, 'test2@gmail.com');
            assert.notEqual(user.password, 'pw_test2');
            done();
          }
        }
      );
    });
    it('return `emailAlreadyExistsError` when the email already exists',
      function (done) {
        userModel.register('test1@gmail.com', 'pw_test1', function (err, user) {
          if (err) {
            assert.equal(err.message, errorMessage.emailAlreadyExistsError);
            done();
          }
          else {
            throw('fail');
          }
        });
      }
    );
  });

  describe('.findByEmail', function () {
    it('registered users should be found', function (done) {
      userModel.findByEmail('test1@gmail.com', function (err, user) {
        if (err) {
          done(err);
        }
        else {
          assert.equal(user.email, 'test1@gmail.com');
          done();
        }
      });
    });
    it('non-registered users should not be found', function (done) {
      userModel.findByEmail('test2@gmail.com', function (err, user) {
        if (err) {
          done(err);
        }
        else {
          assert.equal(user, null);
          done();
        }
      });
    });
  });

  describe('.authenticate', function (done) {
    it('authenticate and return user with valid login', function (done) {
      userModel.authenticate('test1@gmail.com', 'pw_test1', function (err, user) {
        if (err) {
          throw('fail');
        }
        else {
          assert.equal(user.email, 'test1@gmail.com');
          done();
        }
      });
    });

    it('authenticate and fail with invalid password', function (done) {
      userModel.authenticate('test1@gmail.com', 'pw_test2'
        , function (err, user) {
          if (err) {
            assert.equal(err.message, errorMessage.invalidPasswordError);
            done();
            return;
          }
          throw('fail');
        }
      );
    });

    it('authenticate and fail with non-exist email', function (done) {
      userModel.authenticate('test2@gmail.com', 'pw_test2'
        , function (err, user) {
          if (err) {
            assert.equal(err.message, errorMessage.nonExistentEmailError);
            done();
            return;
          }
          throw('fail');
        }
      );
    });
  });

  describe('.subscribeRace', function () {
    it('subscribe and return user with valid email and race id'
      , function (done) {
        userModel.subscribeRace('test1@gmail.com', 2, function (err, user) {
          if (err) {
            done(err);
            return;
          }
          assert.equal(user.email, 'test1@gmail.com');
          assert.equal(user.races.indexOf(2), 1);
          done();
        });
      }
    );
    it('fail with non-existent email', function (done) {
      userModel.subscribeRace('test2@gmail.com', 2, function (err, user) {
        if (err) {
          assert.equal(err.message, errorMessage.nonExistentEmailError);
          done();
          return;
        }
        throw('fail');
      });
    });
    it('fail with repeating race id', function (done) {
      userModel.subscribeRace('test1@gmail.com', 1, function (err, user) {
        if (err) {
          assert.equal(err.message, errorMessage.raceAlreadySubscribedError);
          done();
          return;
        }
        throw('fail');
      });
    });
  });
});
