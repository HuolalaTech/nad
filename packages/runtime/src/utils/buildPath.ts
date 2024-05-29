/**
 * Find all {...} expression in the path, and replace them with values from pathVariables.
 */

export const buildPath = (rawPath: string, pathVariables: Record<string, unknown>) => {
  return rawPath.replace(/\{(.*?)(?::(.*?))?\}/g, (_, key, pattern) => {
    return encodeURIComponent(String(pathVariables[key]));
  });
};
