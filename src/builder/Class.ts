import { Member } from './Member';
import { Type } from './Type';
import { toArray, toString } from '../utils';
import type { Builder } from './Builder';
import { DefBase } from './DefBase';

export class Class extends DefBase {
  readonly typeParameters;
  readonly defName;
  constructor(raw: unknown, builder: Builder) {
    super(raw, builder);
    this.typeParameters = toArray(this.raw?.typeParameters, (i) => toString(i));
    this.defName = this.simpleName;
    if (this.typeParameters.length) {
      const pars = this.typeParameters.join(', ');
      this.defName += `<${pars}>`;
    }
  }

  get members() {
    /**
     * Generic type parameters.
     * For example, the value of typeParameters is [ "T", "M" ] for `class Foo<T, M> {}`
     */
    const value = toArray(this.raw?.members, (i) => new Member(i, this));
    Object.defineProperty(this, 'members', { configurable: true, value });
    return value;
  }

  get superclass() {
    const value = this.raw?.superclass ? Type.create(toString(this.raw.superclass), this) : null;
    Object.defineProperty(this, 'superclass', { configurable: true, value });
    return value;
  }

  findAnnotation<T = Record<string, unknown>>(name: string, deep = false): T | null {
    const anno = this.annotations.find(name);
    if (anno) return anno as T;
    if (deep) {
      const clz = this.superclass?.clz;
      if (clz instanceof Class) return clz.findAnnotation<T>(name, deep);
    }
    return null;
  }

  spread() {
    this.superclass?.valueOf();
    this.members?.valueOf();
  }
}
