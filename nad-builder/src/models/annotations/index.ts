import { NadAnnotation } from '../../types/nad';
import { Dubious, notEmpty, u2a, u2o } from '../../utils';
import { JsonAnnotations } from './JsonAnnotations';

import { SwaggerAnnotations } from './SwaggerAnnotations';
import { WebAnnotations } from './WebAnnocations';

export interface NotNull {
  message: string;
}

export class Annotations {
  private readonly map;
  constructor(raw: Dubious<NadAnnotation>[]) {
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

  find<T = Record<string, unknown>>(name: string, endsWith = false): T | null {
    if (!endsWith) return (this.map.get(name) as T) || null;
    for (const [key, value] of this.map) {
      if (key.endsWith(name)) return value as T;
    }
    return null;
  }
}
