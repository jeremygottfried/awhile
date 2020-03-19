exports = function* generateWorker(priorities, $$tasks, $$do) {
  for(priority in priorities) {
    for(task of priority[$$tasks]) {
      yield task[$$do]();
      priority[$$tasks].shift();
    }
  }
}
