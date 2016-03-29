/**
 * @param {Object} E - A constructor of Eithers:
 * This can be either Sanctuary's Either or Folk-Tale's data.Either
 */
module.exports = function flydEithers(E) {
  return {
    map: require('./lib/map')(E),
    scan: require('./lib/scan')(E),
    endsOnLeft: require('./lib/endsOnLeft')
  };
};
