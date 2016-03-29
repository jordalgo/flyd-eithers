var assert = require('assert');
var flyd = require('flyd');
var S = require('sanctuary');
var Either = require('data.either');
var endsOnLeft = require('../lib/endsOnLeft');

function testSuite(E) {
  it('ends a stream if passed stream passes a Left', function () {
    var s = flyd.stream();
    var ender = flyd.stream();
    endsOnLeft(ender, s);
    ender(E.Right(1));
    assert.equal(s.end.val, undefined);
    ender(E.Left('error'));
    assert(s.end.val);
  });

  it('ends a stream if a Left occurs', function () {
    var map = require('../lib/map')(E);
    var b = flyd.stream();
    var ender = flyd.stream();
    var enderMap = map(function (n) {
      if (n === 1) {
        return 2;
      }
      throw new Error('err');
    }, ender);
    endsOnLeft(enderMap, b);
    ender(E.Right(1));
    assert.equal(b.end.val, undefined);
    ender(E.Right(2));
    assert(b.end.val);
    assert(enderMap().isLeft);
  });
}

describe('endsOnLeft', function () {
  describe('with Sanctuary', function () {
    testSuite(S);
  });
  describe('with data.Either', function () {
    testSuite(Either);
  });
});

