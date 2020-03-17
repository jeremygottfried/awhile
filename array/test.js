var should = require('chai').should();
var expect = require('chai').expect;
const {
  aForEach,
  aMap,
  aFilter,
  aEvery,
  aReduce,
} = require('./index.js');

function sleep(ms) {
  return new Promise(
    resolve => setTimeout(
      () => resolve(), ms
    )
  )
}

function nArray(n) {
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push(i);
  }
  return array;
}


describe('array', function() {
  describe('aForEach', function() {
    it('executes an operation for every element in an array', async function() {
      const array = ['t', 'e', 's', 't'];
      let result = '';
      function callback(current) {
        result += current;
      }

      await aForEach(array, callback);
      result.should.equal('test');

    })

   it('executes async operations on an array in order', async function() {
     const timeArray = [1, 4, 2, 5];
     let result = '';
     async function callback(time) {
       await sleep(time);
       result += time;
     }

     await aForEach(timeArray, callback);
     result.should.equal('1425')
   })

   it('should not block the main thread', async function() {
     const largeArray = nArray(100);
     const result = [];
     function callback(current) {
       result.push(current)
     }
     aForEach(largeArray, callback);
     result.length.should.equal(1);
     await sleep(200);
     result.length.should.equal(100);
   })

   it('accepts a context argument', async function() {
     const arr = ['a', 'b']
     let result;

     function callback() {
       result = this.length;
     }

     await aForEach(arr, callback, arr);
     result.should.equal(2);
   })

   it('receives index and array as extra arguments', async function() {
     const arr = ['a', 'b']
     let result = '';

     function callback(current, index, array) {
       result = result + array.join('') + index;
     }

     await aForEach(arr, callback);
     result.should.equal('ab0ab1')
   })
  })

  describe('aMap', function() {
    it('returns a new array after executing an operation on each element', async function() {
      const arr = [0,1,2,3]

      function callback(current) {
        return current + 1;
      }
      const result = await aMap(arr, callback);
      result.join('').should.equal('1234')
    })

    it('returns a new array after executing async operation on each element in order', async function() {
      const arr = [10,5,8,2]

      async function callback(time) {
        await sleep(time);
        return time * time;
      }
      const result = await aMap(arr, callback);
      result.join(',').should.equal('100,25,64,4')
    })

    it('should not block the main thread', async function() {
      const largeArray = nArray(100);
      let result = [];

      function callback(current) {
        return current;
      }
      aMap(largeArray, callback).then(res => result = res);
      result.length.should.equal(0);
      await sleep(200);
      result.length.should.equal(100);
    })

    it('accepts a context argument', async function() {
      
    })
  })
})
