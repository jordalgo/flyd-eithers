var flyd = require('flyd');

/**
 * If the ender stream emits a Left it ends the passed stream.
 *
 * __Signature__: `Stream Either a b -> Stream Either a b -> Stream Either a c
 *
 * @name endsOnLeft
 * @param {Flyd stream} ender - the stream that will contains Eithers
 * @param {Flyd stream} stream - the stream that will end on an ender Left
 *
 * @example
 * var s1 = flyd.stream(Right(2));
 * var s2 = flyd.stream(Right(1));
 * endsOnLeft(s1, s2);
 * s1(Left('error'));
 * s2.end() //=> true
 */
module.exports = function endsOnLeft(ender, stream) {
  return flyd.endsOn(flyd.combine(function (n) {
    if (n().isLeft) {
      return true;
    }
    return undefined;
  }, [ender]), stream);
};
