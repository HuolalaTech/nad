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
    this.name = owner.builder.fixPropertyName(u2s(name));
    this.type = Type.create(u2s(type), owner);
    this.annotations = new Annotations(u2a(annotations).flat());
    const amp = this.annotations.swagger.getApiModelProperty();
    this.description = amp?.description;

    // It is visible by default unless set to @JsonIgnore or @ApiModelProperty(hidden = true) or @JSONField(serialize = false)
    this.visible = !(
      amp?.hidden === true ||
      this.annotations.json.getJsonIgnore()?.value === true ||
      this.annotations.json.getJSONField()?.serialize === false
    );

    // It is optinoal by default unless set to @NotNull or @ApiModelProperty(required = true)
    this.optional = amp?.required === true || this.annotations.hasNonNull() ? '' : '?';
  }
}
