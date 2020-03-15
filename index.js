"use strict";

module.exports = function awhile(condition, callback) {
  if (condition !== true && typeof condition !== 'function') throw Error('condition must be true or a function')
  let _break = false;

  function fBreak() {
    _break = true;
  }

  function begin() {
    if (_break) return;
    if (typeof condition === 'function' && !condition()) return;
    return new Promise(async (resolve) => {
      await callback(fBreak);
      setTimeout(() => {
        resolve();
      }, 0);
    }).then(begin)
  }

  this.break = fBreak;
  this.begin = begin;

  return Object.freeze(this);
}
