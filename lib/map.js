var curryN = require('ramda/src/curryN');
var flyd = require('flyd');

/**
 * @param {Object} E - Either constructor
 */
module.exports = function mapEither(E) {
  return curryN(2, function cMapEither(f, s) {
    return flyd.combine(function combine(st, self) {
      try {
        self(st.val.map(f));
      } catch (e) {
        self(E.Left(e.message));
      }
    }, [s]);
  });
};
