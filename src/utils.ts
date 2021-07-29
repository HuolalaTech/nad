import { NeverReachHere } from './exceptions';

export const toBoolean = (v: unknown, defaults: boolean) => {
  if (typeof v === 'boolean') return v;
  return defaults;
};

export function toString(str: unknown): string;
export function toString<T>(str: unknown, defaults: T): string | T;
export function toString<T>(str: unknown, defaults?: T): unknown {
  if (typeof str === 'string') return str;
  if (defaults === undefined) return '';
  return defaults;
}

export const toNumber = (num: unknown, defaults = 0) => {
  if (typeof num === 'number') return num;
  return defaults;
};

type MapCallback<A, R> = (value: A extends (infer U)[] ? U : unknown, index: number, array: A) => R;

export function toArray(a: unknown): unknown[];
export function toArray<T>(a: unknown, callbackfn: MapCallback<unknown[], T>): T[];
export function toArray<A>(a: A): A extends readonly unknown[] ? A : unknown[];
export function toArray<A, T>(a: A, callbackfn: MapCallback<A, T>): T[];
export function toArray<T>(a: unknown, callbackfn: MapCallback<unknown, T>): T[];
export function toArray<A>(a: unknown | A, callbackfn?: MapCallback<unknown[] | A, unknown>) {
  if (a instanceof Array) {
    if (callbackfn) return a.map(callbackfn);
    return a;
  }
  return [];
}

export function neverReachHere(): Error;
export function neverReachHere(u: never): Error;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function neverReachHere(u?: never) {
  return new NeverReachHere();
}

export const notEmpty = <T>(w: T): w is NonNullable<T> => w !== null && w !== undefined;

export const isOneOf =
  <T extends string>(a: readonly T[]) =>
  (u: unknown): u is T =>
    a.indexOf(u as T) !== -1;

type AnyMap<K, V> = K extends object ? Map<K, V> | WeakMap<K, V> : Map<K, V>;

export const computeIfAbsent = <K, V>(map: AnyMap<K, V>, key: K, factory: (k: K) => V) => {
  let value = map.get(key);
  if (value === undefined || value === null) {
    value = factory(key);
    map.set(key, value);
  }
  return value;
};
