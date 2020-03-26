const _aForEach = () => [false, undefined];

const _aEvery = (fail) => [!fail, fail];

function _aMap(element, result) {
  if (result === undefined) result = [];
  return [...result, element];
}

function _aFilter(pass, result, current) {
  if (result === undefined) result = [];
  if (pass) result = [...result, current];
  return result;
}

const _aReduce = (acc) => acc;

module.exports = {
  _aForEach,
  _aEvery,
  _aMap,
  _aFilter,
  _aReduce
};
