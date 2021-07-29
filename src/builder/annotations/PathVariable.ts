import { toBoolean } from '../../utils';
import { ValueAliasName } from './ValueAliasName';

export class PathVariable extends ValueAliasName {
  get required() {
    return toBoolean(this.raw.required, true);
  }
}
