import { Route, RouteRaw } from './Route';
import { Dubious } from '../utils';
import { u2a, u2o, u2s } from 'u2x';
import { Root } from './Root';
import { Annotated } from './Annotated';
import { NadModule } from '../types/nad';

type ModuleRaw = Dubious<NadModule>;

export class Module extends Annotated<ModuleRaw> {
  public readonly builder;
  public readonly name;
  public readonly moduleName;
  public readonly routes;
  public readonly description;
  public readonly deprecated;
  constructor(raw: ModuleRaw, builder: Root, list: RouteRaw[]) {
    super(raw);
    this.builder = builder;
    const defs = u2o(raw);
    this.name = u2s(defs.name) ?? '';
    this.moduleName = builder.takeUniqueName(this.name, builder.options.fixModuleName);

    // Move the overloaded zero-parameter method forward.
    //
    // For example:
    // INPUT: class Foo { void foo(int a); void foo(long b); void foo(); }
    // OUTPUT: class Foo { void foo(); void foo(int a); void foo(long b); }
    //
    // This reason is that avoiding the best method name being used by other parametered methods.
    //
    const sList: RouteRaw[] = [];
    const sMap: Record<string, number> = Object.create(null);
    for (let i = 0; i < list.length; i++) {
      const current = list[i];
      const name = String(current.name);
      if (name in sMap) {
        // If the current is a zero-parameter method.
        if (!current.parameters?.length) {
          const index = sMap[name];
          // Move forward to the previous element of first occurred in same name.
          sList.splice(index, 0, current);
          continue;
        }
      } else {
        // It's the first occurrence, mark the index for later use.
        sMap[name] = i;
      }
      sList.push(current);
    }

    this.routes = sList.map((o) => new Route(o, this));

    this.description = this.annotations.swagger.getApi()?.value || '';
    this.deprecated = this.annotations.hasDeprecated();
  }
}
