import { AnyMap } from '.';

export const computeIfAbsent = <K, V>(map: AnyMap<K, V>, key: K, factory: (k: K) => V) => {
  let value = map.get(key);
  if (value === undefined || value === null) {
    value = factory(key);
    map.set(key, value);
  }
  return value;
};
