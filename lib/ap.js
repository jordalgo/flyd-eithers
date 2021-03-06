var curryN = require('ramda/src/curryN');
var flyd = require('flyd');

module.exports = function apEither(E) {
  if (!E || !E.Left || !E.Right) {
    throw new Error('flyd-eithers "ap" needs a proper Either constructor.');
  }
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
  return curryN(2, function (stream1, stream2) {
    return flyd.combine(function (st1, st2, self) {
      try {
        self(st1().ap(st2()));
      } catch (e) {
        self(E.Left(e.message));
      }
    }, [stream1, stream2]);
  });
};
