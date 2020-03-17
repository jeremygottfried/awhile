module.exports = function createVirtualThread(generator) {
  return function begin(arg) {
    const current = generator.next(arg)
    const promise = current.value;
    if (current.done) return;
    return new Promise(async (resolve) => {
      await promise;
      setTimeout(() => {
        resolve();
      }, 0);
    }).then(begin);
  }
}
