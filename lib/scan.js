var curryN = require('ramda/src/curryN');
var flyd = require('flyd');

module.exports = function scan(E) {
  return curryN(3, function(f, acc, st) {
    var ns = flyd.combine(function(s, self) {
      if (acc.isLeft) {
        self(acc);
        return;
      }
      var curriedF = curryN(2, f)(acc.value);
      try {
        self(acc = s.val.map(curriedF));
      } catch (e) {
        self(E.Left(e.message));
      }
    }, [st]);
    if (!ns.hasVal) ns(acc);
    return ns;
  });
};
