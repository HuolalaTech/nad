import { u2s } from '../utils';
import type { Enum } from './Enum';

export class EnumConstant {
  readonly owner: Enum;
  readonly name;
  readonly rawValue: unknown;
  readonly properties: Record<string, unknown>;
  readonly memo: string;
  constructor(raw: unknown, owner: Enum) {
    const { name, value, properties } = Object(raw);
    this.owner = owner;
    this.name = u2s(name);
    this.rawValue = value;
    this.properties = Object(properties);
    const entries = Object.entries(this.properties);
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
