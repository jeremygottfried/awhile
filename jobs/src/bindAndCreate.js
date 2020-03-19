exports = function bindAndCreate(klass, fn) {
  return function(...args) {
    const instance = new klass(..args);
    klass[fn.name] = fn.bind(instance);
    return instance;
  }
}
