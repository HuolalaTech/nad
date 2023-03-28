import { NeverReachHere } from './exceptions';

export function u2o<T>(
  v: T,
): Record<T extends object ? (object extends T ? PropertyKey : keyof T) : PropertyKey, unknown>;
export function u2o(v: unknown): Record<PropertyKey, unknown> {
  return Object(v);
}

type ReplaceNever<N, R = unknown> = N extends never ? R : N;
type GuessElementType<A> = ReplaceNever<A extends (infer U)[] ? U : never>;
type GuessArrayType<A> = GuessElementType<A>[];
type MapCallback<A, R> = (value: GuessElementType<A>, index: number, array: A) => R;

export function u2a<A, T>(a: A, callbackfn: MapCallback<A, T>): T[];
export function u2a<A>(a: A): GuessArrayType<A>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function u2a(a: unknown, callbackfn?: MapCallback<any, unknown>) {
  if (a instanceof Array) {
    if (callbackfn) return a.map(callbackfn);
    return a;
  }
  return [];
}

export const u2s = <T>(u: T) => (typeof u === 'string' ? u : '') as T extends string ? T : string;
export const u2b = (v: unknown, d = false) => (typeof v === 'boolean' ? v : d);

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
  (u: string): u is T =>
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

/**
 * Some objects received from outside are not trusted, like some fields may be of wrong type or missing.
 * This function convert an explicit typed object to a dubious object in two steps:
 * 1. For object types, mark all fields to optional (fields may be missing).
 * 2. Change all non-object types to unknown type (fields may be of wrong type).
 */
export type Dubious<T> = T extends (infer U)[]
  ? Dubious<U>[] | undefined
  : T extends object
  ? {
      [P in keyof T]?: Dubious<T[P]>;
    }
  : unknown;

export type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[] | undefined
  : T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
