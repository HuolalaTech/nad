import { AnnotationBase } from './AnnocationBase';
import { toString } from '../../utils';

export class ValueAliasName extends AnnotationBase {
  get value(): string {
    return toString(this.raw.name || this.raw.value);
  }
}
