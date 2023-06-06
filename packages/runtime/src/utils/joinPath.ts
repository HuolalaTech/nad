/**
 * Join two paths, keeping only a slash in between them.
 * For example joinPath('a', 'b') === 'a/b', and joinPath('a///', '///b') === 'a/b'
 */
export const joinPath = (left: string, right: string) => {
  return left.replace(/[./]+$/, '') + '/' + right.replace(/^[./]+/, '');
};
