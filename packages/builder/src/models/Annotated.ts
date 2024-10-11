import { hideProperty } from '../utils';
import { Annotations } from './annotations';
import { u2a, u2o, u2s } from 'u2x';

export type AnnocatedRaw = { name?: unknown; annotations?: unknown };

export class Annotated<T extends AnnocatedRaw = AnnocatedRaw & { [p in string]: unknown }> {
  readonly name;
  readonly annotations;
  protected readonly raw;
  constructor(raw?: T) {
    this.raw = u2o(raw) as T;
    hideProperty(this, 'raw');
    this.name = u2s(this.raw.name) ?? '';
    this.annotations = Annotations.create(u2a(this.raw.annotations));
  }
}
