# awhile
[![npm version](https://img.shields.io/npm/v/@awhile/awhile.svg)](https://www.npmjs.org/package/@awhile/awhile)    

awhile is a js library for running while loops that don't block the main thread.

Unlike `setInterval`, `awhile` resolves promises in order. If a task is asynchronous, the next task won't begin until the previous task resolves. In this way, you can use awhile like a virtual stack, and you can even use it to create a queuing system for task priority. `awhile` behaves similarly to a promise chain, except microtasks will be broken up task by task so that they don't block the queue.

Unlike a normal `while` loop, `awhile` can run infinitely without blocking the main thread.

Eg. Both of these loops will run without blocking each other:
```js
loop1.begin();
loop2.begin();
```

## Installation

```sh
npm install @awhile/awhile
```

or

```sh
yarn add @awhile/awhile
```

## Usage

Here is a simple counting loop;
```js
const awhile = require('@awhile/awhile')

let count = 0;

function condition() {
  return count < 5;
}

function callback() {
  count += 1;
}

const loop = new awhile(condition, callback);
loop.begin();
```

Note that a condition must be passed to `awhile` as a function, or as `true`.
```js
let count = 0;

function condition() {
  return count < 5;
}
```

awhile comes with a `break` function that can be called inside the callback or outside. `break` is a reserved word, so use an underscore like `_break` or another word like `stop` or `end`.

Here is a loop that will break after 5 seconds:
```js
shouldStop = false;
setTimeout(() => shouldStop = true, 5000);

function callback(_break) {
  if (shouldStop) return _break();

  doWork();
}
```

You can also call break outside the loop:
```js
const loop = new awhile(condition, callback);
loop.begin();
loop.break(); // will stop after the current task;
```

If you want the browser to use its default batching mechanism for promises, you can pass `true` to the `begin` function.
This option will improve performance in some cases. It will behave slightly differently, because now some groups of promises will be batched.
```js
const loop = new awhile(condition, callback);

loop.begin(true)
```

The case where this option will cause issues is if you run an infinite loop, but your callback is not actually doing any async behavior. This example will block the main thread indefinitely:
```js
async function callback() {
  return "bar"
}

new awhile(true, callback).begin(true);
```

`awhile` can also be treated as one big promise.

In this case, `done` will not be logged until the entire loop is complete;
```js
function callback() {
  return somePromise;
}

(async function() {
  const loop = new awhile(condition, callback);

  await loop.begin();

  console.log('done')
})()
```

The real power of awhile is that it allows you to run multiple infinite loops at the same time.

In the example below, these loops will both run infinitely without blocking each other.
```js

const loop1 = new awhile(true, callback);
const loop2 = new awhile(true, callback);

loop1.begin();
loop2.begin();
```

awhile is also great for building custom versions of common browser APIs.
Here is a full example where I use `awhile` to build `setInterval`:

```js
var awhile = require("@awhile/awhile")

function setInterval(callback, time) {

  const timer = () => new Promise(resolve => {
    setTimeout(() => {
      resolve();
      callback();
    }, time);
  })

  const loop = new awhile(true, timer);
  loop.begin();
  return loop;
}

function clearInterval(loop) {
  loop.break();
}

function callback() {
  console.log('bro')
}

const interval = setInterval(callback, 1000);
setTimeout(() => clearInterval(interval), 10000)
```

## Under the hood

By default, `awhile` treats each callback as its own batch (chain) of microtasks. This differs from a for loop, which sometimes groups all `await` statements into a single batch (chain) of microtasks.

For example:

Using awhile:
```js

callback() {
  promise1().
  then(promise2)
  .then(promise3)
}

new awhile(condition, callback).begin();
```
Each time awhile calls the callback, it creates a new microtask batch instead of grouping all callbacks into a single promise chain.

A native JS `while` loop sometimes groups them.
These callbacks may be grouped into a single promise chain, potentially blocking the queue until all microtasks are complete.
```
while(condition) {
 await callback();
}
```

## Caveats
`awhile` comes in handy when you want tasks to function like a background thread. For example, if you have an array of pending tasks that is frequently updated. If you want to automatically carry out those tasks in order, awhile is a great tool.

`awhile` can be used like a normal awhile loop, **but it will be considerably slower** for basic tasks like synchronously iterating through an array. For most looping tasks, the native while loop is better.

Before using awhile, consider using a built-in javascript API to handle async tasks in order.

A `for` loop can be used inside an async function to create a promise chain.

```js
async function chainWork() {
  let workArray = [work1, work2, work3, work4]

  for (const work of workArray) {
    await work();
  }
}
```

Under the hood, this resolves to
```
work1()
.then(work2)
.then(work3)
.then(work4)
```

Consider using `setInterval` for a synchronous task that needs to be looped continuously.
```js
setInterval(task, 10)
```

## Background

ES6 Javascript introduced the promise and async/await paradigms.

Promise is an API for interacting with asynchronous tasks.
Promises wrap an asynchronous task in a helpful interface that handles resolution and rejection.

The `then` property gives you a callback that is executed when the async task is complete.

Example
```js
promise.then((json) => {
  console.log(json)
})
```

Promises also introduced the concept of micro and macro tasks.
Micro-tasks are given precedence in the queue, because they are often time sensitive.
Promise callbacks are treated as micro tasks. A chain of promises may be batched together, all occurring before the next macro task.

For example:
```js
Promise.resolve()
.then(work1)
.then(work2)
.then(work3)
```

`awhile` takes advantage of the promise interface to create task loops that don't block the main thread.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
ISC(https://opensource.org/licenses/ISC)
