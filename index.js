module.exports = function flydEithers(E) {
  if (!E || !E.Left || !E.Right) {
    throw new Error('flyd-eithers needs a proper Either constructor.');
  }
  return {
    map: require('./lib/map')(E),
    scan: require('./lib/scan')(E),
    ap: require('./lib/ap')(E),
    toEither: require('./lib/toEither')(E),
    endsOnLeft: require('./lib/endsOnLeft')
  };
};
