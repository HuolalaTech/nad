import { NadInvoker } from './NadInvoker';
import type { Settings } from './NadInvoker';

if (typeof window === 'object') {
  if ('NadInvoker' in window) {
    // eslint-disable-next-line no-console
    console.error('"@huolala-tech/nad-runtime" installed duplicately with different versions.');
  }
  Object.defineProperty(window, 'NadInvoker', { configurable: true, value: NadInvoker });
}

export { NadInvoker };
export type { Settings };
