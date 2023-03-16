import { Annotations } from './annotations';
import { u2a, u2o, u2s } from '../utils';

export class Annotated {
  readonly name;
  readonly annotations;
  protected readonly raw;
  constructor(raw: unknown) {
    this.raw = u2o(raw);
    this.name = u2s(this.raw.name);
    this.annotations = new Annotations(u2a(this.raw.annotations));
  }
}
