const awhile = require('@awhile/awhile').default;

exports = function Loop() {
  let loop;
  function restart(callback) {
    if (loop) loop.break();
    loop = new awhile(true, callback)
    loop.begin();
  }
  this.restart = restart;
}
