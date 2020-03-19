exports = function doWork(worker) {
  return function (callback) {
    const { value, done } = worker.next();
    if (done) return callback(value);
    return value;
  }
}
