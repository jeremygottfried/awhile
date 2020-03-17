const awhile = require('@awhile/awhile');
const { typeCheckIterator } = require('./helpers')

exports.basicIterator = function basicIterator(iterator) {
  return async function arrayProtoGeneric(array, callback, context) {
    typeCheckIterator(array, callback);
    if (context) callback = callback.bind(context);

    return iterator(array, callback, context);
  }
}

exports.breakIf = function breakIf(iterator) {
  return async function(array, callback, context) {
    let index = 0;
    let cBreak = false;
    let result;

    function condition() {
      return index < array.length;
    }

    async function _callback(fBreak) {
      if (cBreak) return fBreak();
      const current = array[index];
      const callbackReturn = await callback(current, index, array);
      [cBreak, result] = iterator(callbackReturn, current, result);
      index++
    }

    const loop = new awhile(condition, _callback);
    await loop.begin();

    return result;
  }
}
