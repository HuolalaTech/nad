import { toBoolean } from '../../utils';
import { ValueAliasName } from './ValueAliasName';

export class RequestBody extends ValueAliasName {
  get required() {
    return toBoolean(this.raw.required, true);
  }
}
