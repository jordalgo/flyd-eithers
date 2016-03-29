var flyd = require('flyd');

module.exports = function endsOnLeft(ender, stream) {
  return flyd.endsOn(flyd.combine(function (n) {
    if (n().isLeft) {
      return true;
    }
    return undefined;
  }, [ender]), stream);
};
