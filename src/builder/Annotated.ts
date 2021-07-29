import { Annotations } from './annotations';
import { toArray, toString } from '../utils';

export class Annotated {
  readonly name;
  readonly annotations;
  protected readonly raw: Record<string, unknown>;
  constructor(raw: unknown) {
    this.raw = Object(raw);
    this.name = toString(this.raw.name);
    this.annotations = new Annotations(toArray(this.raw.annotations));
  }
}
