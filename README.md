# awhile

awhile is a library for iterating and looping without blocking the main thread or event loop queue. 
It uses "virtual threads" that only occupy the main thread during a promise resolution.

| Package                                                                              | Version                                                                                                                         |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **[@awhile/awhile](/awhile)** <br />Main module | [![npm version](https://img.shields.io/npm/v/@awhile/awhile.svg)](https://www.npmjs.org/package/@awhile/awhile)             |

Basic Usage of `awhile` module:

```js
const awhile = require('@awhile/awhile')

const loop = new awhile(condition, callback);

// start the non-blocking loop
loop.begin();

// end the non blocking loop
loop.break();
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
ISC(https://opensource.org/licenses/ISC)
