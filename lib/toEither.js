var flyd = require('flyd');
var isEither = require('./isEither');
var mapGen = require('./map');
var mapRightsGen = require('./mapRights');
var scanGen = require('./scan');
var apGen = require('./ap');

module.exports = function toEither(E) {
  if (!E || !E.Left || !E.Right) {
    throw new Error('flyd-eithers "toEither" needs a proper Either constructor.');
  }
  var map = mapGen(E);
  var mapRights = mapRightsGen(E);
  var scan = scanGen(E);
  var ap = apGen(E);

  function addEitherMethodsToStream(stream) {
    stream.map = function (fn) {
      return addEitherMethodsToStream(map(fn, this));
    };
    stream.mapRights = function (fn) {
      return addEitherMethodsToStream(mapRights(fn, this));
    };
    stream.scan = function (fn, acc) {
      return addEitherMethodsToStream(scan(fn, acc, this));
    };
    stream.ap = function (stream2) {
      return addEitherMethodsToStream(ap(this, stream2));
    };
    return stream;
  }
  /**
   * Returns a Flyd Stream.
   * A special Flyd Stream with:
   * - map
   * - scan
   * - ap
   *
   * that act on the Eithers within them.
   * **Important** don't pass values into this newly created stream.
   * Use the original stream to pass values.
   *
   * __Signature__: `Stream a -> Stream Either a b
   *
   * @name toEither
   * @param {flyd-stream} stream
   * @return {flyd-stream} the stream that now only contains Eithers
   *
   * @example
   * var S = require('sanctuary');
   * var toEither = require('flyd-eithers/lib/toEither')(S);
   * var s1 = flyd.stream();
   * var s1Either = toEither(s1);
   * s1(1);
   * s1Either(); //=> Right(1);
   */
  return function (stream) {
    var eitherStream = flyd.combine(function (s, self) {
      var val = s();
      if (isEither(val)) {
        self(val);
      } else {
        self(E.Right(val));
      }
    }, [stream]);

    // Add on functions for chaining
    return addEitherMethodsToStream(eitherStream);
  };
};
