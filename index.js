const mapEither = require('./lib/mapEither');

/**
 * @param {Object} E - A constructor of Eithers:
 * This can be either Sanctuary's Either or Folk-Tale's data.Either
 */
module.exports = function flydEithers(E) {
  return {
    mapEither: mapEither(E),
  };
};
