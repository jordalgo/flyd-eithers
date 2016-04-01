module.exports = function isEither(val) {
  return val !== undefined && val !== null && (val.isLeft || val.isRight);
};
