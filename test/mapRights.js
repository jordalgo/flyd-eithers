var assert = require('assert');
var flyd = require('flyd');

function testSuite(E, mapRights) {
  it('only maps over only right values', function () {
    var a = flyd.stream(E.Right(0));
    var b = mapRights(function (x) { return x + 1; }, a);
    assert.equal(b().value, 1);
    assert(b().isRight);
    a(E.Left('error'));
    assert.equal(b().value, 1);
    assert(b().isRight);
    a(E.Right(2));
    assert.equal(b().value, 3);
    assert(b().isRight);
  });
  it('emits only right values', function () {
    var a = flyd.stream();
    var b = mapRights(function (x) { return x + 1; }, a);
    var emitCount = 0;
    flyd.on(function () {
      emitCount++;
    }, b);
    a(E.Left('error'));
    a(E.Right(2));
    assert.equal(emitCount, 1);
  });
  it('swallows errors caused by the map', function () {
    var a = flyd.stream(E.Right(0));
    var b = mapRights(function () { throw new Error('blah'); }, a);
    assert.equal(b(), undefined);
  });
}

describe('map', function () {
  require('./eitherLibs').forEach(function (either) {
    describe('with ' + either.name, function () {
      testSuite(either.fn, require('../lib/mapRights')(either.fn));
    });
  });
});

