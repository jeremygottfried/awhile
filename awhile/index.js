"use strict";

const createVirtualThread = require('./src/createVirtualThread').default;
const createVirtualThread_SafetyOff = require('./src/createVirtualThread').createVirtualThread_SafetyOff

exports.default = function awhile(condition, callback) {
  if (condition !== true && typeof condition !== 'function') throw Error('condition must be true or a function')
  let _break = false;

  function fBreak() {
    _break = true;
  }

  const loop = (function* () {
    while(true) {
      if (_break) break;
      if (typeof condition === 'function' && !condition()) break;
      yield callback(fBreak);
    }
  })()

  const begin = function(safetyOff=false) {
    if (safetyOff) return createVirtualThread_SafetyOff(loop)()
    else return createVirtualThread(loop)();
  }

  this.break = fBreak;
  this.begin = begin;

  return Object.freeze(this);
}

exports.createVirtualThread = createVirtualThread;
