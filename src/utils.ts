import { NeverReachHere } from './exceptions';

export const u2b = (v: unknown, d = false) => (typeof v === 'boolean' ? v : d);

export const u2s = <T>(u: T) => (typeof u === 'string' ? u : '') as T extends string ? T : string;
export const u2n = <T>(u: T) => (typeof u === 'number' ? u : 0) as T extends number ? T : number;

type MapCallback<A, R> = (value: A extends (infer U)[] ? U : unknown, index: number, array: A) => R;

export function u2a(a: unknown): unknown[];
export function u2a<T>(a: unknown, callbackfn: MapCallback<unknown[], T>): T[];
export function u2a<A>(a: A): A extends readonly unknown[] ? A : unknown[];
export function u2a<A, T>(a: A, callbackfn: MapCallback<A, T>): T[];
export function u2a<T>(a: unknown, callbackfn: MapCallback<unknown, T>): T[];
export function u2a<A>(a: unknown | A, callbackfn?: MapCallback<unknown[] | A, unknown>) {
  if (a instanceof Array) {
    if (callbackfn) return a.map(callbackfn);
    return a;
  }
  return [];
}

export function neverReachHere(): Error;
export function neverReachHere(u: never): Error;
export function neverReachHere(u: never, message: string): Error;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function neverReachHere(u?: never, message?: string) {
  return new NeverReachHere(message);
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
