var curryN = require('ramda/src/curryN');
var flyd = require('flyd');

module.exports = function (E) {
  if (!E || !E.Left || !E.Right) {
    throw new Error('flyd-eithers "map" needs a proper Either constructor.');
  }
  /**
   * Returns a Flyd Stream with an Either value.
   * If the map throws or if the pre-mapped value is a Left,
   * the returned Stream will contain a Left.
   *
   * __Signature__: `(b -> c) -> Stream Either a b -> Stream Either a c
   *
   * @name map
   * @param {Function} f - the mapping function
   * @param {flyd-stream} s - the stream that contains the Either
   * @return {flyd-stream} the mapped stream with an Either
   *
   * @example
   * var S = require('sanctuary');
   * var map = require('flyd-eithers/lib/map')(S);
   * var addOne = function(x) { return x+1; };
   * var s = flyd.stream(Right(5));
   * map(addOne, s)(); //=> Right(6);
   */
  return curryN(2, function (f, s) {
    return flyd.combine(function (st, self) {
      try {
        self(st.val.map(f));
      } catch (e) {
        self(E.Left(e.message));
      }
    }, [s]);
  });
};
