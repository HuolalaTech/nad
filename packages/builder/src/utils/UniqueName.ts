import { computeIfAbsent } from './computeIfAbsent';
import { UniqueNameCreatingError } from '../exceptions';

const heap = new WeakMap<object, UniqueName>();

export class UniqueName {
  private set = new Set<string>();
  private indexMap = new Map<string, number>();

  private take(str: string) {
    if (this.set.has(str)) return false;
    this.set.add(str);
    return true;
  }

  public lookup(str: string) {
    return this.set.has(str);
  }

  /**
   * Create a unique name based on a prefix.
   */
  public create(prefix: string, sep = '$') {
    if (this.take(prefix)) return prefix;
    const { indexMap } = this;
    const begin = computeIfAbsent(indexMap, prefix, () => 1);
    for (let i = begin; i < 100; i++) {
      const n = `${prefix}${sep}${i}`;
      if (this.take(n)) {
        indexMap.set(prefix, i + 1);
        return n;
      }
    }
    throw new UniqueNameCreatingError(prefix);
  }

  /**
   * Create a unique name based on a prefix in a scope.
   * NOTE: Same names are allowed between different scopes.
   */
  public static createFor(scope: object, prefix: string, sep?: string) {
    return computeIfAbsent(heap, scope, UniqueName.newInstance).create(prefix, sep);
  }

  public static lookupFor(scope: object, str: string) {
    return computeIfAbsent(heap, scope, UniqueName.newInstance).lookup(str);
  }

  public static newInstance() {
    return new UniqueName();
  }
}
