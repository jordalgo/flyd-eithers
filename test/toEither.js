var assert = require('assert');
var flyd = require('flyd');

function testSuite(E, toEither) {
  it('creates a stream of eithers', function () {
    var a = flyd.stream();
    var b = toEither(a);
    a(1);
    assert.deepEqual(b(), E.Right(1));
    a('hello');
    assert.deepEqual(b(), E.Right('hello'));
    a({ me: 'JR' });
    assert.deepEqual(b(), E.Right({ me: 'JR' }));
    a(undefined);
    assert.deepEqual(b(), E.Right(undefined));
    a(null);
    assert.deepEqual(b(), E.Right(null));
  });
  it('doesnt wrap existing Eithers', function () {
    var a = flyd.stream();
    var b = toEither(a);
    a(E.Right(1));
    assert.deepEqual(b(), E.Right(1));
    a(E.Left('error'));
    assert.deepEqual(b(), E.Left('error'));
  });
  it('has a map function that acts on Eithers', function () {
    var a = flyd.stream();
    var b = toEither(a);
    var add1 = function (x) { return x + 1; };
    var c = b.map(add1);
    a(1);
    assert.deepEqual(c(), E.Right(2));
  });
  it('has a scan function that acts on Eithers', function () {
    var a = flyd.stream();
    var b = toEither(a);
    var sum = function (acc, x) { return acc + x; };
    var c = b.scan(sum, E.Right(5));
    a(5);
    assert.deepEqual(c(), E.Right(10));
  });
  it('has a ap function that acts on Eithers', function () {
    var a = flyd.stream();
    var b = toEither(a);
    var c = flyd.stream();
    var d = b.ap(c);
    function add1(x) { return x + 1; }
    a(add1);
    c(E.Right(1));
    assert.deepEqual(d(), E.Right(2));
    c(E.Left('error'));
    assert.deepEqual(d(), E.Left('error'));
  });
  it('can chain either methods', function () {
    var a = flyd.stream();
    var add1 = function (x) { return x + 1; };
    var sum = function (acc, x) { return acc + x; };
    var c = toEither(a)
      .map(add1)
      .scan(sum, E.Right(5));
    a(1);
    assert.deepEqual(c(), E.Right(7));
    a(2);
    assert.deepEqual(c(), E.Right(10));
  });
}

describe('toEither', function () {
  describe('with Sanctuary', function () {
    var S = require('sanctuary');
    var toEither = require('../lib/toEither')(S);
    testSuite(S, toEither);
  });
  describe('with data.Either', function () {
    var Either = require('data.either');
    var toEither = require('../lib/toEither')(Either);
    testSuite(Either, toEither);
  });
});

