import { toArray, toString } from '../utils';
import { Annotations } from './annotations';
import type { Class } from './Class';
import { Type } from './Type';

export class Member {
  public readonly type;
  public readonly name;
  public readonly annotations;
  public readonly description;
  constructor(raw: unknown, public readonly owner: Class) {
    const { name, type, annotations } = Object(raw);
    this.name = owner.builder.fixPropertyName(toString(name));
    this.type = Type.create(toString(type), owner);
    this.annotations = new Annotations(toArray(annotations).flat());
    this.description = this.annotations.swagger.getApiModelProperty()?.description;
  }
}
