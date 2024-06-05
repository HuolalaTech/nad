export const setOrDelete = (obj: Record<string, unknown>, key: string, value: unknown) => {
  if (value === undefined) {
    delete obj[key];
  } else {
    obj[key] = value;
  }
};
