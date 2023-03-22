export const isNonNullObject = <T>(obj: T): obj is T & Record<PropertyKey, unknown> => {
  return obj !== null && typeof obj === 'object';
};
