const _aForEach = require('./prototypes')._aForEach
const { basicIterator, breakIf } = require('./iteratorCreators')

const aForEach = basicIterator(breakIf(_aForEach));

exports.default = aForEach;
