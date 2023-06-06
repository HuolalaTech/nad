/**
 * Find the first value that matches the key in a case-insensitive manner.
 */
export const insensitiveGet = <T>(object: Record<string, T>, name: string) => {
  const keys = Object.keys(object);
  const ln = name.toLowerCase();
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].toLowerCase() === ln) return object[keys[i]];
  }
  return null;
};
