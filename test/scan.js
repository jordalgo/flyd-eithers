var assert = require('assert');
var flyd = require('flyd');

function testSuite(E, scan) {
  it('scans on the value within a Right', function () {
    var a = flyd.stream(E.Right(5));
    var b = scan(function (acc, x) { return acc + x; }, E.Right(5), a);
    assert.equal(b().value, 10);
    assert(b().isRight);
    a(E.Right(10));
    assert.equal(b().value, 20);
  });
  it('does not scan on the value within a Left', function () {
    var a = flyd.stream(E.Left(5));
    var b = scan(function (acc, x) { return acc + x; }, E.Right(5), a);
    assert(b().isLeft);
  });
  it('does not scan on the value within a Left accumulator', function () {
    var a = flyd.stream(E.Right(5));
    var b = scan(function (acc, x) { return acc + x; }, E.Left(5), a);
    assert(b().isLeft);
  });
  it('produces a Left if the accumulator throws', function () {
    var a = flyd.stream(E.Right(1));
    var b = scan(function () {
      throw new Error('e');
    }, E.Right(1), a);
    assert(b().isLeft);
  });
}

describe('scan', function () {
  describe('with Sanctuary', function () {
    var S = require('sanctuary');
    var scan = require('../lib/scan')(S);
    testSuite(S, scan);
  });
  describe('with data.Either', function () {
    var Either = require('data.either');
    var scan = require('../lib/scan')(Either);
    testSuite(Either, scan);
  });
});

