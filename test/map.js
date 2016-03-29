var assert = require('assert');
var flyd = require('flyd');

function testSuite(E, map) {
  it('does map on the value within a Right', function () {
    var a = flyd.stream(E.Right(0));
    var b = map(function (x) { return x + 1; }, a);
    assert.equal(b().value, 1);
    assert(b().isRight);
  });

  it('does not map on the value within a Left', function () {
    var a = flyd.stream(E.Left(0));
    var b = map(function (x) { return x + 1; }, a);
    assert.equal(b().value, 0);
    assert(b().isLeft);
  });

  it('catches errors in a Left', function () {
    var a = flyd.stream(E.Right(0));
    var b = map(function () { throw new Error('hello'); }, a);
    assert.equal(b().value, 'hello');
    assert(b().isLeft);
  });

  it('creates a Left if you try to map on a non-Either', function () {
    var a = flyd.stream(0);
    var b = map(function (x) { return x + 1; }, a);
    assert(b().isLeft);
  });
}

describe('map', function () {
  describe('with Sanctuary', function () {
    var S = require('sanctuary');
    var map = require('../lib/map')(S);
    testSuite(S, map);
  });
  describe('with data.Either', function () {
    var Either = require('data.either');
    var map = require('../lib/map')(Either);
    testSuite(Either, map);
  });
});

