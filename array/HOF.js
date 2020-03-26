const awhile = require('@awhile/awhile');
const { typeCheckIterator } = require('./helpers');
const aForEach = require('./aForEach').default;

exports.mapHOF = function mapHOF(iterator) {
  return async function(array, callback) {
    let result;
    async function _callback(current, index, array) {
      const callbackReturn = await callback(current, index, array);
      result = iterator(callbackReturn, result, current);
    }

    await aForEach(array, _callback);
    return result;
  }
}

exports.reduceHOF = function reduceHOF(iterator) {
  return async function(array, callback, initialValue = undefined) {
    typeCheckIterator(array, callback);
    let result = initialValue;
    if (result === undefined) result = array[0];
    if (result === undefined) throw Error('if array is empty, an initial value must be provided')

    async function _callback(current, index, array) {
      const callbackReturn = await callback(result, current, index, array)
      result = iterator(callbackReturn, current, result)
    }

    await aForEach(array, _callback)
    return result;
  }
}
