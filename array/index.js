const {
  mapHOF,
  reduceHOF
} = require('./HOF');

const {
  basicIterator,
  breakIf
} = require('./iteratorCreators');

const {
  _aMap,
  _aFilter,
  _aEvery,
  _aReduce
} = require('./prototypes');

const aForEach = require('./aForEach').default;

const aMap = basicIterator(mapHOF(_aMap))
const aFilter = basicIterator(mapHOF(_aFilter));
const aEvery = basicIterator(breakIf(_aEvery));
const aReduce = reduceHOF(_aReduce);

module.exports = {
  aForEach,
  aMap,
  aFilter,
  aEvery,
  aReduce,
}
