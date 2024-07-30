import { isJavaNumber, isJavaPrimitive, isJavaString } from '../helpers/javaHelper';
import { u2a, u2o, u2s } from 'u2x';
import { Annotations } from './annotations';
import type { Class } from './Class';
import { Type, TypeUsage } from './Type';
import { Dubious, notEmpty, toSnake } from '../utils';
import { NadMember } from '../types/nad';
import { Enum } from './Enum';

export class Member {
  public readonly type;
  public readonly name;
  public readonly annotations: Annotations;
  public readonly description;
  public readonly visible: boolean;
  public readonly optional: '' | '?';
  public readonly deprecated;
  public readonly narrowValues?: string[];
  constructor(
    raw: Dubious<NadMember>,
    public readonly owner: Class,
  ) {
    this.annotations = Annotations.create(u2a(raw.annotations).filter(notEmpty).map(u2o).flat());

    const { fixPropertyName } = owner.options;
    if (this.annotations.json.alias) {
      this.name = fixPropertyName(this.annotations.json.alias);
    } else {
      const rawName = u2s(raw.name) ?? '';
      if (owner.annotations.json.needToSnake) {
        this.name = fixPropertyName(toSnake(rawName));
      } else {
        this.name = fixPropertyName(rawName);
      }
    }
    this.type = Type.create(u2s(raw.type), owner, TypeUsage.memberType);

    const amp = this.annotations.swagger.getApiModelProperty();

    if (amp?.allowableValues && amp.allowableValues.length) {
      this.narrowValues = amp.allowableValues;
    }

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

    this.deprecated = this.annotations.hasDeprecated();
  }
}
