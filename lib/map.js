var curryN = require('ramda/src/curryN');
var flyd = require('flyd');

/**
 * @param {Either constructor} E - (tested with Sanctuary and data.Either)
 * @return {Function} the map function for streams with Eithers.
 */
module.exports = function (E) {
  /**
   * Returns a Flyd Stream with an Either value.
   * If the map throws or if the pre-mapped value is a Left,
   * the returned Stream will contain a Left.
   *
   * __Signature__: `(b -> c) -> Stream Either a b -> Stream Either a c
   *
   * @name map
   * @param {Function} f - the mapping function
   * @param {Flyd stream} s - the stream that contains the Either
   * @return {Flyd stream} the mapped stream with an Either
   *
   * @example
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
