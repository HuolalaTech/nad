import { Annotations } from './annotations';
import { u2a, u2o, u2s } from '../utils';

export type AnnocatedRaw = { name?: unknown; annotations?: unknown };

export class Annotated<T extends AnnocatedRaw = AnnocatedRaw & { [p in string]: unknown }> {
  readonly name;
  readonly annotations;
  protected readonly raw;
  constructor(raw?: T) {
    this.raw = u2o(raw) as T;
    this.name = u2s(this.raw.name);
    this.annotations = new Annotations(u2a(this.raw.annotations));
  }
}
