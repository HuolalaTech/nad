import { NadEnumConstant } from '../types/nad';
import { Dubious, u2o } from '../utils';
import { Annotated } from './Annotated';
import type { Enum } from './Enum';

type EnumConstantRaw = Dubious<NadEnumConstant<unknown>>;

export class EnumConstant extends Annotated<EnumConstantRaw> {
  readonly owner: Enum;
  readonly rawValue: unknown;
  readonly properties: Record<string, unknown>;
  readonly description;
  readonly memo: string;
  constructor(raw: EnumConstantRaw, owner: Enum) {
    super(raw);
    const { value, properties } = u2o(raw);
    this.owner = owner;
    this.rawValue = value;
    this.properties = u2o(properties);
    const entries = Object.entries(this.properties);
    this.description = this.annotations.swagger.getApiModelProperty()?.description;
    this.memo = entries
      .map((i) => i.join('='))
      .join('; ')
      .replace(/[\r\n]/g, ' ');
  }
  get value() {
    switch (this.owner.valueType) {
      case 'number':
        return Number(this.rawValue);
      case 'string':
        return String(this.rawValue);
      default:
        return this.name;
    }
  }
}
