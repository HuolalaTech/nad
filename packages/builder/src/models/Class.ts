import { Member } from './Member';
import { Type, TypeUsage } from './Type';
import { Dubious } from '../utils';
import { u2a, u2s } from 'u2x';
import { DefBase } from './DefBase';
import { NadClass } from '../types/nad';
import { RawClass } from './RawDef';

type ClassRaw = Dubious<NadClass>;

export class Class extends DefBase<ClassRaw> {
  /**
   * Generic type parameters.
   * For example, the value of typeParameters is [ "T", "M" ] for `class Foo<T, M> {}`
   */
  public readonly typeParameters;
  public readonly defName;
  public readonly description;
  public readonly modifiers;
  private readonly rawClass;

  constructor(rawClass: RawClass) {
    super(rawClass.raw, rawClass.root);
    this.rawClass = rawClass;
    this.typeParameters = u2a(this.raw.typeParameters, u2s);
    this.modifiers = rawClass.modifiers;
    this.defName = this.simpleName;

    this.description = this.annotations.swagger.getApiModel()?.description;
    if (this.typeParameters.length) {
      const pars = this.typeParameters.join(', ');
      this.defName += `<${pars}>`;
    }
  }

  get members() {
    // TODO: Declare interfaces and remove members which are duplicate with super interfaces.
    const value = u2a(this.raw.members, (i) => new Member(i, this)).filter((m) => m.visible);
    Object.defineProperty(this, 'members', { configurable: true, value });
    return value;
  }

  get superclass() {
    const value = Type.create(u2s(this.raw.superclass), this, TypeUsage.superType);
    Object.defineProperty(this, 'superclass', { configurable: true, value });
    return value;
  }

  public hasConstructor() {
    return this.rawClass.hasConstructor();
  }

  public spread() {
    const { superclass, members, name, builder } = this;
    superclass.valueOf();
    members.valueOf();
    // Touch all classes which is extending this class.
    for (const [rawClz] of builder.findDerivativedRefs(name)) {
      if (rawClz.hasConstructor()) rawClz.use();
    }
  }
}
