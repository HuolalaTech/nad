import { notEmpty, u2o } from '../../utils';
import { JsonAnnotations } from './JsonAnnotations';

import { SwaggerAnnotations } from './SwaggerAnnotations';
import { WebAnnotations } from './WebAnnocations';

export interface ApiDocField {
  description: string;
  name: string;
  required: boolean;
  example: string;
}

export interface NotNull {
  message: string;
}

export interface Max {
  value: number;
  message: string;
}

export interface Min {
  value: number;
  message: string;
}

export class Annotations {
  private readonly raw;
  constructor(raw: unknown | unknown[]) {
    this.raw = raw instanceof Array ? raw : [];
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

  getNotNull() {
    return this.find<NotNull>('javax.validation.constraints.NotNull');
  }

  getMax() {
    return this.find<Max>('javax.validation.constraints.Max');
  }
  getMin() {
    return this.find<Min>('javax.validation.constraints.Min');
  }

  hasNonNull() {
    return !!this.find<NotNull>('.NonNull', true);
  }

  private readonly cache: Record<string, unknown> = Object.create(null);
  find<T = Record<string, unknown>>(name: string, endsWith = false): T | null {
    const { cache } = this;
    const ck = JSON.stringify([name, endsWith]);
    if (ck in cache) return cache[ck] as T;
    const result = Annotations.find(this.raw, name, endsWith) as T;
    cache[ck] = result;
    return result;
  }

  public toString() {
    return Array.from(Annotations.gen(this.raw), (i) => i.type).join(', ');
  }

  // TODO: list more javax.validation.constraints.*
  static *listPrefix(raw: unknown[], prefix: string) {
    for (const { type, attributes } of this.gen(raw)) {
      if (type.startsWith(prefix)) {
        const name = type.slice(prefix.length);
        const value = u2o(attributes);
        yield { name, value };
      }
    }
  }

  static find(raw: unknown[], name: string, endsWith = false) {
    for (const { type, attributes } of this.gen(raw)) {
      if (endsWith ? type.endsWith(name) : type === name) {
        return u2o(attributes);
      }
    }
    return null;
  }

  static *gen(raw: unknown[]) {
    if (raw instanceof Array) {
      for (const i of raw) {
        if (!i) continue;
        const { type, attributes } = u2o(i);
        if (typeof type !== 'string') continue;
        yield { type, attributes };
      }
    }
  }

  static create(raw: unknown) {
    return new Annotations(raw);
  }

  static merge(...a: (Annotations | undefined)[]) {
    const raw = a
      .filter(notEmpty)
      .map((i) => i.raw)
      .flat();
    return new Annotations(raw);
  }
}
