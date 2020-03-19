const createTask = require('./src/createTask');
const generateWorker = require('./src/generateWorker');
const doWork = require('./src/doWork');
const createStack = require('./src/createStack');
const Loop = require('./src/loop');

exports.default = function Queue(priorities) {
  const _priorities = {};
  const workLoop = new Loop();
  const $$do = new Symbol('do');
  const $$args = new Symbol('args');
  const $$tasks = new Symbol('tasks');

  function restart() {
    const worker = generateWorker(_priorities, $$tasks, $$do);
    const work = doWork(worker);
    workLoop.restart(work);
  }

  const Task = createTask($$args, $$do);
  const Stack = createStack(Task, restart, $$args, $$tasks);
  priorities.forEach((priority) => _priorities[priority] = new Stack(priority));
}
