import { toArray } from '../utils';
import type { Builder } from './Builder';
import { DefBase } from './DefBase';
import { EnumConstant } from './EnumConstant';

export class Enum extends DefBase {
  readonly constants;
  readonly valueType;
  constructor(raw: unknown, builder: Builder) {
    super(raw, builder);
    this.constants = toArray(this.raw.constants, (i) => new EnumConstant(i, this));
    this.valueType = this.initValueType();
  }
  private initValueType() {
    // All enum values should be of the same type, either of 'string' or 'number'.
    // Otherwise, it should be regarded as 'unknown'.
    const valueTypes = Array.from(new Set(this.constants.map((i) => typeof i.rawValue)));
    let vt = valueTypes.length === 1 ? valueTypes[0] : ('unknown' as const);
    if (vt !== 'string' && vt !== 'number') vt = 'unknown' as const;
    return vt;
  }
}
