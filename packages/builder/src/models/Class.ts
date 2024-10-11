import { Member } from './Member';
import { Type, TypeUsage } from './Type';
import { Dubious, Modifier, notEmpty } from '../utils';
import { u2a, u2n, u2s } from 'u2x';
import { DefBase } from './DefBase';
import { NadClass } from '../types/nad';
import { Root } from './Root';

type ClassRaw = Dubious<NadClass>;

export class Class extends DefBase<ClassRaw> {
  /**
   * Generic type parameters.
   * For example, the value of typeParameters is [ "T", "M" ] for `class Foo<T, M> {}`
   */
  public readonly typeParameters;
  public readonly description;
  public readonly modifiers;
  public readonly bounds;

  constructor(raw: ClassRaw, parent: Root) {
    super(raw, parent);
    this.typeParameters = u2a(this.raw.typeParameters, u2s);
    this.modifiers = u2n(this.raw.modifiers);
    this.bounds = [this.raw.superclass, ...u2a(this.raw.interfaces)].map((i) => u2s(i)).filter(notEmpty);

    this.description = this.annotations.swagger.getApiModel()?.description;
  }

  public get defName() {
    let value = this.simpleName;
    if (this.typeParameters.length) {
      const pars = this.typeParameters.join(', ');
      value += `<${pars}>`;
    }
    Object.defineProperty(this, 'defName', { configurable: true, value });
    return value;
  }

  public get members() {
    // TODO: Declare interfaces and remove members which are duplicate with super interfaces.
    const value = u2a(this.raw.members, (i) => new Member(i, this)).filter((m) => m.visible);
    Object.defineProperty(this, 'members', { configurable: true, value });
    return value;
  }

  public get superclass() {
    const value = Type.create(u2s(this.raw.superclass), this, TypeUsage.superType);
    Object.defineProperty(this, 'superclass', { configurable: true, value });
    return value;
  }

  public hasConstructor() {
    const { modifiers } = this;
    if (modifiers === undefined) return true;
    return !Modifier.isAbstract(modifiers) && !Modifier.isInterface(modifiers);
  }

  public spread() {
    const { superclass, members, name, root: builder } = this;
    superclass.valueOf();
    members.valueOf();
    // Touch all classes which is extending this class.
    for (const [rawClz] of builder.findDerivativedRefs(name)) {
      if (rawClz.hasConstructor()) builder.touchDef(rawClz);
    }
  }
}
