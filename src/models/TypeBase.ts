import type { Class } from './Class';
import type { Root } from './Root';
import { neverReachHere } from '../utils';

export type TypeOwner = Class | Root;

const wm = new WeakMap<object, TypeOwner>();

export class TypeBase<T extends TypeBase<T>> {
  public readonly name;
  public readonly parameters;

  constructor(owner: TypeOwner, name: string, parameters: readonly T[]) {
    this.name = name;
    this.parameters = parameters;
    wm.set(this, owner);
  }

  get owner() {
    const owner = wm.get(this);
    /* istanbul ignore next */
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
    return this.builder.isEnum(this.name);
  }
}
