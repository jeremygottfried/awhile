const awhile = require('./index.js').default;
const should = require('chai').should();
const expect = require('chai').expect;
const fetch = require("node-fetch");

describe('awhile', function() {
  it('should continue loop until a condition is met', async function() {
    let count = 0;
    function callback() {
      count += 1;
    }
    function condition() {
      return count < 5;
    }
    await new awhile(condition, callback).begin(true);
    count.should.equal(5);
    count = 0;
    await new awhile(condition, callback).begin()
    count.should.equal(5);
  })

  it('should carry out asynchronous tasks in order', async function() {
    let index = 0;
    let result = '';
    function resolveStr(str, time) {
      return new Promise(resolve => setTimeout(() => resolve(str), time))
    }
    const arr = [resolveStr('a', 0), resolveStr('b', 30), resolveStr('c', 10), resolveStr('d', 20)]

    // If the array is iterated with forEach instead of awhile, the test fails.
    //
    // arr.forEach(async (letter) => {
    //   const str = await letter;
    //   result += str;
    // });

    async function callback() {
      const str = await arr[index];
      result += str;
      index += 1;
    }

    function condition() {
      return index < arr.length
    }
    await new awhile(condition, callback).begin(true);
    result.should.equal('abcd');
    index = 0;
    result = '';
    await new awhile(condition, callback).begin();
    result.should.equal('abcd');
  })

  it('should break if break function is called inside callback', async function() {
    let count = 0;
    let _condition = true;

    function callback(_break) {
      if (count > 9) return _break();
      count += 1;
    }

    const timeout = setTimeout(() => _condition = false, 2000)

    function condition() {
      return _condition;
    }

    await new awhile(condition, callback).begin();
    count.should.equal(10)
    count = 0;
    await new awhile(condition, callback).begin(true);
    count.should.equal(10)
    clearTimeout(timeout);
  })

  it('should break if break function is called outside callback', async function() {
    let _condition = true;
    let count = 0;
    const timeout = setTimeout(() => _condition = false, 2000)

    function callback() {
      return new Promise(resolve => setTimeout(() => {
        count += 1;
        resolve();
      }, 10))
    }

    function condition() {
      return _condition;
    }

    const loop = new awhile(condition, callback);
    const interval = setInterval(() => {
      if (count > 5) loop.break();
    }, 1)
    await loop.begin();
    expect(count).to.be.above(5)
    clearInterval(interval);

    count = 0;
    const loop2 = new awhile(condition, callback);
    const interval2 = setInterval(() => {
      if (count > 5) loop2.break();
    }, 1)
    clearInterval(interval2);
    clearTimeout(timeout);
  })
  it('should mostly not block the main thread if true is passed to begin function', async function() {
    let variable;

    async function callback() {
       const res = await fetch('http://google.com')
       return 'test';
    }

    const loop = new awhile(true, callback);
    loop.begin(true);
    await new Promise((resolve) => {
      setTimeout(() => {
        variable = 'test';
        resolve();
      }, 0)
    })
    variable.should.equal('test');
    loop.break();
  })

  it('should not block main thread', async function() {

    let variable;
    let variable2 = '';
    async function callback() {
      return 'foo'
    }
    function callback2() {}
    const loop = new awhile(true, callback)
    const loop2 = new awhile(true, callback2)
    loop2.begin();
    loop.begin();
    await new Promise((resolve) => {
      resolve();
    }).then(() => {
      variable = 'test';
    })
    await new Promise((resolve) => {
      setTimeout(() => {
        variable2 = 'test';
        resolve();
      }, 0)
    })
    variable.should.equal('test');
    variable2.should.equal('test');
    loop.break();
    loop2.break();
  })
})
