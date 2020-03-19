const bindAndCreate = require('./bindAndCreate');

exports = function createStack(Task, restart, $$args, $$tasks) {
  return function Stack(name) {
    const tasks = [];

    function scheduleTask(...args) {
      this[$$args] = args;
      tasks.push(task);
      restart();
    }
    this.add = bindAndCreate(Task, scheduleTask);
    this[$$tasks] = tasks;
  }
}
