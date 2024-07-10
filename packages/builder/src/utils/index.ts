export * from './LexicalReader';
export * from './UniqueName';
export * from './computeIfAbsent';
export * from './neverReachHere';
export * from './parseDsv';

export const notEmpty = <T>(w: T): w is NonNullable<T> => w !== null && w !== undefined;

export const isOneOf =
  <T extends string>(a: readonly T[]) =>
  (u: string): u is T =>
    a.indexOf(u as T) !== -1;

/**
 * Convert snake to upper camel.
 */
export const toUpperCamel = (n: string) =>
  n
    .replace(/(?:[\W_]+|^)([a-z]?)/g, (_, z) => z.toUpperCase())
    // A variable name cannot start with numbers, so add a prefix "The".
    .replace(/^\d+/, 'The$&');

/**
 * Convert snake to lower camel.
 */
export const toLowerCamel = (n: string) => toUpperCamel(n).replace(/^[A-Z]/, (s) => s.toLowerCase());

/**
 * Convert camel to snake.
 */
export const toSnake = (n: string) =>
  n
    .split(/(?=[^a-z])/)
    .join('_')
    .replace(/[\W_]+/g, '_')
    .toLowerCase();

// Remove dynamic suffixes from proxy class names, such as $$EnhancerByCGLIB*, $$FastClassByCGLIB*, and so on.
export const removeDynamicSuffix = (name: string) => name.replace(/\$\$.*/, '');

export const getPureClassName = (name: string) => removeDynamicSuffix(name).replace(/^.*?([^.]+)$/, '$1');

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
