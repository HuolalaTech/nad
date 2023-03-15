import { Annotations } from './annotations';
import { u2a, u2s } from '../utils';

export class Annotated {
  readonly name;
  readonly annotations;
  protected readonly raw: Record<string, unknown>;
  constructor(raw: unknown) {
    this.raw = Object(raw);
    this.name = u2s(this.raw.name);
    this.annotations = new Annotations(u2a(this.raw.annotations));
  }
}
