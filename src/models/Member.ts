import { isJavaPrimitive } from '../helpers/javaHelper';
import { u2a, u2o, u2s } from '../utils';
import { Annotations } from './annotations';
import type { Class } from './Class';
import { Type } from './Type';

export class Member {
  public readonly type;
  public readonly name;
  public readonly annotations: Annotations;
  public readonly description;
  public readonly visible: boolean;
  public readonly optional: '' | '?';
  constructor(raw: unknown, public readonly owner: Class) {
    const { name, type, annotations } = u2o(raw);
    this.annotations = new Annotations(u2a(annotations).flat());
    const aliasOrName = this.annotations.json.alias || name;
    this.name = owner.builder.fixPropertyName(u2s(aliasOrName));
    this.type = Type.create(u2s(type), owner);
    const amp = this.annotations.swagger.getApiModelProperty();
    this.description = amp?.description;

    // It is visible by default unless one or more following conditions are met:
    // 1. The @JsonIgnore is set (jackson).
    // 2. The @JSONField(serialize = false) is set (fastjson).
    // 3. The @ApiModelProperty(hidden = true) is set.
    // NOTE: Nad does not known which serialization library is actually used by backend service,
    //       so both jackson and fastjson annotations will be followed.
    this.visible = !(amp?.hidden === true || this.annotations.json.isIgnored);

    // It is optinoal by default unless set to @NotNull or @ApiModelProperty(required = true) or JavaPrimitive types.
    this.optional =
      amp?.required === true || this.annotations.hasNonNull() || isJavaPrimitive(this.type.name) ? '' : '?';
  }
}
