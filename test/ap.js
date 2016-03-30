var assert = require('assert');
var flyd = require('flyd');

function testSuite(E, ap) {
  it('does ap on a Right value', function () {
    var a = flyd.stream(E.Right(function (x) { return x + 2; }));
    var b = flyd.stream(E.Right(5));
    var c = ap(a, b);
    assert.equal(c().value, 7);
    assert(c().isRight);
  });

  it('does not ap on a Left value', function () {
    var a = flyd.stream(E.Right(function (x) { return x + 2; }));
    var b = flyd.stream(E.Left('err'));
    var c = ap(a, b);
    assert(c().isLeft);
  });

  it('does not ap on a Left value', function () {
    var a = flyd.stream(E.Left('err'));
    var b = flyd.stream(E.Right(0));
    var c = ap(a, b);
    assert(c().isLeft);
  });

  it('creates a Left if the ap throws', function () {
    var a = flyd.stream(E.Right(function () {
      throw new Error('err');
    }));
    var b = flyd.stream(E.Right(2));
    var c = ap(a, b);
    assert(c().isLeft);
  });
}

describe('ap', function () {
  describe('with Sanctuary', function () {
    var S = require('sanctuary');
    var ap = require('../lib/ap')(S);
    testSuite(S, ap);
  });
  describe('with data.Either', function () {
    var Either = require('data.either');
    var ap = require('../lib/ap')(Either);
    testSuite(Either, ap);
  });
});

