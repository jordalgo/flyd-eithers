var curryN = require('ramda/src/curryN');
var flyd = require('flyd');

module.exports = function scan(E) {
  if (!E || !E.Left || !E.Right) {
    throw new Error('flyd-eithers "scan" needs a proper Either constructor.');
  }
  /**
   * Returns a Flyd Stream.
   * If the operation fails it fills the stream with a Left value.
   *
   * __Signature__: `(acc -> a -> b) -> Either a b -> Stream Either a c
   *
   * @name scan
   * @param {Function} fn - reducer function
   * @param {either} acc - an either (perhaps containing the accumulator)
   * @param {flyd-stream} stream - a stream containing an Either
   * @return {flyd-stream} the scanned stream
   *
   * @example
   * var S = require('sanctuary');
   * var scan = require('flyd-eithers/lib/scan')(S);
   * var add = function(acc, x) { return acc + x; };
   * var s = flyd.stream(Right(1));
   * scan(add, Right(5), s)(); //=> Right(6);
   */
  return curryN(3, function (fn, acc, stream) {
    var ns = flyd.combine(function (s, self) {
      var curriedF = curryN(2, fn)(acc.value);
      if (acc.isLeft) {
        self(acc);
        return;
      }
      try {
        self(acc = s.val.map(curriedF));
      } catch (e) {
        self(acc = E.Left(e.message));
      }
    }, [stream]);
    if (!ns.hasVal) ns(acc);
    return ns;
  });
};
