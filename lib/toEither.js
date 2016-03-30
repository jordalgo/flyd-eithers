var flyd = require('flyd');
var mapGen = require('./map');
var scanGen = require('./scan');

module.exports = function toEither(E) {
  if (!E || !E.Left || !E.Right) {
    throw new Error('flyd-eithers "toEither" needs a proper Either constructor.');
  }
  var map = mapGen(E);
  var scan = scanGen(E);
  /**
   * Returns a Flyd Stream.
   * If the operation fails it fills the stream with a Left value.
   *
   * __Signature__: `Stream Either a b -> Stream Either a b -> Stream Either a c
   *
   * @name ap
   * @param {flyd-stream} stream1 - the stream that contains the function
   * @param {flyd-stream} stream2 - the stream that contains the value
   * @return {flyd-stream} the combined applied stream
   *
   * @example
   * var S = require('sanctuary');
   * var ap = require('flyd-eithers/lib/ap')(S);
   * var s1 = flyd.stream(Right(addOne));
   * var s2 = flyd.stream(Right(1));
   * ap(s1, s2)(); //=> Right(2);
   */
  return function (stream) {
    var eitherStream = flyd.combine(function (s, self) {
      var val = s();
      if (val !== undefined &&
          val !== null &&
          (val.isLeft || val.isRight)) {
        self(val);
      } else {
        self(E.Right(val));
      }
    }, [stream]);

    // Add on functions for chaining
    eitherStream.map = function (fn) { return map(fn, this); };
    eitherStream.scan = function (fn, acc) { return scan(fn, acc, this); };
    return eitherStream;
  };
};
