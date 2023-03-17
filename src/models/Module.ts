import { Route } from './Route';
import { u2a, u2o, u2s } from '../utils';
import type { Root } from './Root';
import { UniqueName } from './UniqueName';
import { Annotated } from './Annotated';

export class Module extends Annotated {
  public readonly builder;
  public readonly name;
  public readonly moduleName;
  public readonly routes;
  public readonly description;
  constructor(raw: unknown, builder: Root, list: unknown[]) {
    super(raw);
    this.builder = builder;
    const defs = u2o(raw);
    this.name = u2s(defs.name);
    this.moduleName = UniqueName.createFor(
      this.builder,
      // For example, convert "cn.xxx.xxx.People$$wtf23333" to "People"
      this.builder.fixModuleName(this.name.match(/[^.]+$/)?.[0].replace(/\$\$.*/, '') || '$'),
      this.builder.uniqueNameSeparator,
    );
    this.routes = u2a(list, (i) => new Route(i, this));
    this.description = this.annotations.swagger.getApi()?.value || '';
  }
}
