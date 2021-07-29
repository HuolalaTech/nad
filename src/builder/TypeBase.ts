import type { Class } from './Class';
import type { Builder } from './Builder';
import { neverReachHere } from '../utils';

export type TypeOwner = Class | Builder;

const wm = new WeakMap<object, TypeOwner>();

export class TypeBase<T extends TypeBase<T>> {
  public name;
  public parameters;

  constructor(owner: TypeOwner, name = '', parameters: T[] = []) {
    this.name = name;
    this.parameters = parameters;
    wm.set(this, owner);
  }

  get owner() {
    const owner = wm.get(this);
    if (!owner) throw neverReachHere();
    return owner;
  }

  get builder() {
    const { owner } = this;
    if ('builder' in owner) return owner.builder;
    return owner;
  }

  get isGenericVariable() {
    if ('typeParameters' in this.owner) {
      return this.owner.typeParameters.includes(this.name);
    }
    return false;
  }

  get isEnum() {
    return this.name === 'java.lang.Enum';
  }
}
