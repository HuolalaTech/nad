export const notEmpty = <T>(u: T): u is Exclude<T, null | undefined> => u != null && u !== undefined;
