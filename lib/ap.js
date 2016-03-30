var curryN = require('ramda/src/curryN');
var flyd = require('flyd');

/**
 * @param {Either constructor} E - (tested with Sanctuary and data.Either)
 * @return {Function} the apply function for streams with Eithers.
 */
module.exports = function apEither(E) {
  /**
   * Returns a Flyd Stream.
   * If the operation fails it fills the stream with a Left value.
   *
   * __Signature__: `Stream Either a b -> Stream Either a b -> Stream Either a c
   *
   * @name ap
   * @param {Flyd stream} s1 - the stream that contains the function
   * @param {Flyd stream} s2 - the stream that contains the value
   * @return {Flyd stream} the combined applied stream
   *
   * @example
   * var s1 = flyd.stream(Right(addOne));
   * var s2 = flyd.stream(Right(1));
   * ap(s1, s2)(); //=> Right(2);
   */
  return curryN(2, function (s1, s2) {
    return flyd.combine(function (st1, st2, self) {
      try {
        self(st1().ap(st2()));
      } catch (e) {
        self(E.Left(e.message));
      }
    }, [s1, s2]);
  });
};
