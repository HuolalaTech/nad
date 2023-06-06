console.error = jest.fn();

Object.defineProperties(global, {
  window: { configurable: true, value: void 0 },
  e7de5b84066fc28a0206fbac19447bc2: {
    configurable: true,
    enumerable: true,
    value: true,
  },
});

import { NadInvoker } from '..';
import './libs/mock-xhr';

test(`basic`, async () => {
  new NadInvoker();
  expect(console.error).toBeCalledTimes(1);
});
