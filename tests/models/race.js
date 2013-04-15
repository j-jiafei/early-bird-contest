/// \author Jeff Jia

var errorMessage = require('../../routes/error-message');
var testConstant = require('../test-constant');
var raceModel = require('../../models/race');
var errorMessage = require('../../routes/error-message');

var mongoose = require('mongoose');
var async = require('async');
var assert = require('assert');

describe('raceModel', function () {

  var Race = mongoose.model('Race');
  mongoose.connect(testConstant.mongoDbTestUrl, function E (err) {
    if (err) {
      if (err.state != 2) {
        throw(err);
      }
    }
  });

  beforeEach(function (done) {
    async.series([
      function (callback) {
        Race.remove({}, callback);
      }
      , function (callback) {
        raceModel.create('race1', {}, callback);
      }
      , function (callback) {
        raceModel.create('race3', {}, callback);
      }
    ], function (err) {
      if (err) {
        done(err);
      }
      else {
        done();
      }
    });
  });

  afterEach(function (done) {
    Race.remove({}, done);
  });

  describe('.create', function () {
    it('Create and store race with valid info', function (done) {
      raceModel.create('race2', {}, function (err, race) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(race.title, 'race2');
        done();
      });
    });

    it('Fail with repeating title', function (done) {
      raceModel.create('race1', {}, function (err, race) {
        if (err) {
          assert.equal(err.message, errorMessage.raceTitleAlreadyExistsError);
          done();
          return;
        }
        throw('fail');
      });
    });
  });

  describe('.findByTitle', function () {
    it ('Return race if title exists', function (done) {
      raceModel.findByTitle('race1', function (err, race) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(race.title, 'race1');
        done();
      });
    });
    it ('null if title does not exist', function (done) {
      raceModel.findByTitle('race2', function (err, race) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(race, null);
        done();
      });
    });
  });
});
