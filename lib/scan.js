var curryN = require('ramda/src/curryN');
var flyd = require('flyd');

/**
 * @param {Either constructor} E - (tested with Sanctuary and data.Either)
 * @return {Function} the scan function for streams with Eithers.
 */
module.exports = function scan(E) {
  /**
   * Returns a Flyd Stream.
   * If the operation fails it fills the stream with a Left value.
   *
   * __Signature__: `(acc -> a -> b) -> Either a b -> Stream Either a c
   *
   * @name scan
   * @param {Function} f - reducer function
   * @param {Either} acc - an either (perhaps containing the accumulator)
   * @param {Flyd stream} st - a stream containing an Either
   * @return {Flyd stream} the scanned stream
   *
   * @example
   * var add = function(acc, x) { return acc + x; };
   * var s = flyd.stream(Right(1));
   * scan(add, Right(5), s)(); //=> Right(6);
   */
  return curryN(3, function (f, acc, st) {
    var ns = flyd.combine(function (s, self) {
      var curriedF = curryN(2, f)(acc.value);
      if (acc.isLeft) {
        self(acc);
        return;
      }
      try {
        self(s.val.map(curriedF));
      } catch (e) {
        self(E.Left(e.message));
      }
    }, [st]);
    if (!ns.hasVal) ns(acc);
    return ns;
  });
};
