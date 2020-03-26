exports.typeCheckIterator = function typeCheckIterator(array, callback) {
  if (!Array.isArray(array)) throw Error('first argument must be an array')
  if (typeof callback !== 'function') throw Error('second argument must be a function')
}
