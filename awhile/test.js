const awhile = require('./index.js').default;
var should = require('chai').should();
var expect = require('chai').expect;

describe('awhile', function() {
  it('should continue loop until a condition is met', async function() {
    let count = 0;
    function callback() {
      count += 1;
    }
    function condition() {
      return count < 5;
    }
    await new awhile(condition, callback).begin();
    count.should.equal(5);
  })

  it('should carry out asynchronous tasks in order', async function() {
    let index = 0
    let result = ''
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
    await new awhile(condition, callback).begin();
    await new Promise((resolve) => setTimeout(() => resolve(), 200))
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
    clearTimeout(timeout);
    count.should.equal(10)
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
    clearTimeout(timeout);
    clearInterval(interval);
    expect(count).to.be.above(5)
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
