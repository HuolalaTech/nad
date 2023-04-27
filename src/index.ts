import { NadInvoker } from './NadInvoker';

export * from './NadRuntime';
export * from './NadInvoker';
export * from './errors';

// Find the globalThis object across browsers and miniprogram platforms.
const globalThis =
  typeof window === 'object' ? window : typeof global === 'object' ? global : /* istanbul ignore next */ null;
if (globalThis) {
  // This key is the MD5 hash of the package name.
  const key = 'e7de5b84066fc28a0206fbac19447bc2';
  if (key in globalThis) {
    // Throw an error if this key was set in the global object.
    console.error(new Error(`The "nad-runtime" lib was installed duplicately with different versions.`));
  } else {
    // Set the key to the global object.
    Object.defineProperty(globalThis, key, {
      configurable: true,
      value: NadInvoker,
    });
  }
}
