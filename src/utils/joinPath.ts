export const joinPath = (a: string, b: string) => {
  let u = a;
  if (u[u.length - 1] !== '/') u += '/';
  u += b.replace(/^[./]+/, '');
  return u;
};
