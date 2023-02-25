import { Route } from './Route';
import { toArray } from '../utils';
import type { Root } from './Root';
import { UniqueName } from './UniqueName';

export class Module {
  public readonly moduleName;
  public readonly apis;
  public readonly description;
  constructor(public name: string, private list: unknown[], public builder: Root) {
    this.moduleName = UniqueName.createFor(
      this.builder,
      // For example, convert "cn.xxx.xxx.People$$wtf23333" to "People"
      this.builder.fixModuleName(this.name.match(/[^.]+$/)?.[0].replace(/\$\$.*/, '') || '$'),
      this.builder.uniqueNameSeparator,
    );
    this.apis = toArray(list, (i) => new Route(i, this));
    this.description = ''; // toString(this.raw?.description);
  }
}
