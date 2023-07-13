export * from './SyntaxReader';
export * from './UniqueName';
export * from './computeIfAbsent';
export * from './neverReachHere';

export const notEmpty = <T>(w: T): w is NonNullable<T> => w !== null && w !== undefined;

export const isOneOf =
  <T extends string>(a: readonly T[]) =>
  (u: string): u is T =>
    a.indexOf(u as T) !== -1;

export type AnyMap<K, V> = K extends object ? Map<K, V> | WeakMap<K, V> : Map<K, V>;

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
