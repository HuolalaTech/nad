import { isJavaPrimitive } from '../helpers/javaHelper';
import { u2a, u2o, u2s } from 'u2x';
import { Annotations } from './annotations';
import type { Class } from './Class';
import { Type } from './Type';
import { Dubious, notEmpty, toLowerCamel } from '../utils';
import { NadMember } from '../types/nad';

export class Member {
  public readonly type;
  public readonly name;
  public readonly annotations: Annotations;
  public readonly description;
  public readonly visible: boolean;
  public readonly optional: '' | '?';
  constructor(
    raw: Dubious<NadMember>,
    public readonly owner: Class,
  ) {
    const { name, type, annotations } = raw;
    this.annotations = Annotations.create(u2a(annotations).filter(notEmpty).map(u2o).flat());
    this.name = owner.options.fixPropertyName(u2s(this.annotations.json.alias || name) || '');
    this.type = Type.create(u2s(type), owner);
    const amp = this.annotations.swagger.getApiModelProperty();
    this.description = amp?.value;

    // A member is visible by default unless any following special cases are met:
    this.visible = true;
    // CASE 1. The @ApiModelProperty(hidden = true) is set.
    if (amp?.hidden === true) this.visible = false;
    // CASE 2. The JSON decorator is describs ignore.
    // jackson: The @JsonIgnore is set.
    // fastjson: The @JSONField(serialize = false) is set.
    // NOTE: Nad does not known which serialization library is actually used by backend service,
    //       so both jackson and fastjson annotations will be followed.
    if (this.annotations.json.isIgnored) this.visible = false;
    // CASE 3. Invalid property name.
    // In this case, the backend can be serialize correct JSON data,
    // but the type cannot be declared as a standard code model on frontend.
    if (!this.name || /[^\w$]/.test(this.name)) this.visible = false;

    // It is optinoal by default unless set to @NotNull or @ApiModelProperty(required = true) or JavaPrimitive types.
    this.optional =
      amp?.required === true || this.annotations.hasNonNull() || isJavaPrimitive(this.type.name) ? '' : '?';
  }
}
