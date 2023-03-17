import { Annotated } from './Annotated';
import type { Root } from './Root';
import { UniqueName } from './UniqueName';

export class DefBase extends Annotated {
  public readonly moduleName;
  public readonly builder;
  constructor(raw: unknown, builder: Root) {
    super(raw);
    this.builder = builder;
    this.moduleName = UniqueName.createFor(
      builder,
      builder.fixClassName(this.name.replace(/^.*?(?=[^.]*$)/, '')),
      builder.uniqueNameSeparator,
    );
  }
}
