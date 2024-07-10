import { NadAnnotation } from '../../types/nad';
import { Dubious, computeIfAbsent, notEmpty } from '../../utils';
import { u2a, u2o } from 'u2x';
import { JsonAnnotations } from './JsonAnnotations';

import { SwaggerAnnotations } from './SwaggerAnnotations';
import { WebAnnotations } from './WebAnnocations';

export interface NotNull {
  message: string;
}

const cache = new WeakMap<Dubious<NadAnnotation>[], Annotations>();

export class Annotations {
  private readonly map;

  /**
   * Do not construct this class directly, use Annotations.create to instread.
   */
  private constructor(raw: Dubious<NadAnnotation>[]) {
    const entries = u2a(raw, (u) => {
      if (!u) return null;
      const { type, attributes } = u2o(u);
      if (typeof type !== 'string') return null;
      return [type, u2o(attributes)] as const;
    }).filter(notEmpty);
    this.map = new Map(entries);
  }

  get web() {
    const value = new WebAnnotations(this);
    Object.defineProperty(this, 'web', { value, configurable: true });
    return value;
  }

  get swagger() {
    const value = new SwaggerAnnotations(this);
    Object.defineProperty(this, 'swagger', { value, configurable: true });
    return value;
  }

  get json() {
    const value = new JsonAnnotations(this);
    Object.defineProperty(this, 'json', { value, configurable: true });
    return value;
  }

  hasNonNull() {
    // lombok.NonNul
    // org.springframework.lang.NonNull
    if (this.find<NotNull>('.NonNull', true)) return true;

    // javax.annotation.Nonnull;
    if (this.find<NotNull>('.Nonnull', true)) return true;

    // javax.validation.constraints.NotNull
    if (this.find<NotNull>('.NotNull', true)) return true;

    return false;
  }

  hasDeprecated() {
    if (this.find<NotNull>('java.lang.Deprecated')) return true;
    return false;
  }

  find<T = Record<string, unknown>>(name: string, endsWith = false): T | null {
    if (!endsWith) return (this.map.get(name) as T) || null;
    for (const [key, value] of this.map) {
      if (key.endsWith(name)) return value as T;
    }
    return null;
  }

  static create(raw: Dubious<NadAnnotation>[]): Annotations;
  static create(raw: Dubious<NadAnnotation>[] | undefined): Annotations | undefined;
  static create(raw?: Dubious<NadAnnotation>[] | undefined) {
    if (typeof raw !== 'object' || raw === null) return undefined;
    return computeIfAbsent(cache, raw, () => new this(raw));
  }
}
