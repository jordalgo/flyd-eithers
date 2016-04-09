var curryN = require('ramda/src/curryN');
var flyd = require('flyd');

module.exports = function (E) {
  if (!E || !E.Left || !E.Right) {
    throw new Error('flyd-eithers "mapRights" needs a proper Either constructor.');
  }
  /**
   * Returns a Flyd Stream with an Right Value
   * If the map throws or if the pre-mapped value is a Left,
   * the returned Stream will not emit any value.
   *
   * __Signature__: `(b -> c) -> Stream Either a b -> Stream Right c
   *
   * @name map
   * @param {Function} fn - the mapping function
   * @param {flyd-stream} stream - the stream that contains the Either
   * @return {flyd-stream} the mapped stream with a Right
   *
   * @example
   * var S = require('sanctuary');
   * var map = require('flyd-eithers/lib/map')(S);
   * var addOne = function(x) { return x+1; };
   * var s = flyd.stream(Right(5));
   * map(addOne, s)(); //=> Right(6);
   */
  return curryN(2, function (fn, stream) {
    return flyd.combine(function (st, self) {
      if (st.val.isRight) {
        try {
          self(st.val.map(fn));
        } catch (e) {
          // swallowed error
        }
      }
    }, [stream]);
  });
};
