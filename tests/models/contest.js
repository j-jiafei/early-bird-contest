/// \author Jeff Jia

var errorMessage = require('../../helpers/error-message');
var testConstant = require('../test-constant');
var contestData = require('../../models/contest');

var mongoose = require('mongoose');
var async = require('async');
var assert = require('assert');

describe('contestData', function () {

  var Contest = mongoose.model('Contest');
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
        Contest.remove({}, callback);
      }
      , function (callback) {
        contestData.newContest('contest1', {}, callback);
      }
      , function (callback) {
        contestData.newContest('contest3', {}, callback);
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
    Contest.remove({}, done);
  });

  describe('.newContest', function () {
    it('Create and store contest with valid info', function (done) {
      contestData.newContest('contest2', {}, function (err, contest) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(contest.title, 'contest2');
        done();
      });
    });

    it('Fail with repeating title', function (done) {
      contestData.newContest('contest1', {}, function (err, contest) {
        if (err) {
          assert.equal(err.message, errorMessage.contestTitleAlreadyExistsError);
          done();
          return;
        }
        throw('fail');
      });
    });

    it('Fail with invalid title', function (done) {
      contestData.newContest('', {}, function (err, contest) {
        if (err) {
          assert.equal(err.message, errorMessage.contestTitleInvalidError);
          done();
          return;
        }
        throw('fail');
      });
    });
  });

  describe('.findByTitle', function () {
    it('Return contest if title exists', function (done) {
      contestData.findByTitle('contest1', function (err, contest) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(contest.title, 'contest1');
        done();
      });
    });
    it('null if title does not exist', function (done) {
      contestData.findByTitle('contest2', function (err, contest) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(contest, null);
        done();
      });
    });
  });

  describe('.findAll', function () {
    it('Return all the contests', function (done) {
      contestData.findAll(function (err, contests) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(contests.length, 2);
        assert.equal(contests[0].title, 'contest1');
        assert.equal(contests[1].title, 'contest3');
        done();
      });
    });
    it('Return [] when there are no contests', function (done) {
      Contest.remove({}, function (err) {
        if (err) {
          done(err);
          return;
        }
        contestData.findAll(function (err, contests) {
          if (err) {
            done(err);
            return;
          }
          assert.equal(contests.length, 0);
          done();
        });
      });
    });
  });

});
