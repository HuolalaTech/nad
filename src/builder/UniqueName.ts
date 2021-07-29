import { UniqueNameCreatingError } from '../exceptions';

const heap = new WeakMap<object, UniqueName>();

export class UniqueName {
  private set = new Set<string>();
  private take(str: string) {
    if (this.set.has(str)) return false;
    this.set.add(str);
    return true;
  }

  /**
   * Create a unique name based on a prefix.
   */
  public create(prefix: string, sep = '$') {
    if (this.take(prefix)) return prefix;
    for (let i = 1; i < 100; i++) {
      const n = `${prefix}${sep}${i}`;
      if (this.take(n)) return n;
    }
    throw new UniqueNameCreatingError(prefix);
  }

  /**
   * Create a unique name based on a prefix in a scope.
   * NOTE: Same names are allowed between different scopes.
   */
  public static createFor(scope: object, prefix: string, sep?: string) {
    let unm = heap.get(scope);
    if (!unm) {
      unm = new UniqueName();
      heap.set(scope, unm);
    }
    return unm.create(prefix, sep);
  }
}
