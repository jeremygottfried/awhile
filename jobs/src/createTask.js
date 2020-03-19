exports = function createTask($$args, $$do) {
  return function Task(task) {
    if (typeof task !== 'function') throw Error('task must be a function')
    this[$$do] = () => task(...this[$$args])
  }
}
