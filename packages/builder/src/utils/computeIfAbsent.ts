type AnyMap<K, V> = K extends object ? Map<K, V> | WeakMap<K, V> : Map<K, V>;

export const computeIfAbsent = <K, V>(map: AnyMap<K, V>, key: K, factory: (k: K) => V) => {
  let value = map.get(key);
  if (value === undefined || value === null) {
    value = factory(key);
    map.set(key, value);
  }
  return value;
};
