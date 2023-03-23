import { AnnocatedRaw, Annotated } from './Annotated';
import type { Root } from './Root';
import { UniqueName } from './UniqueName';

export class DefBase<T extends AnnocatedRaw = AnnocatedRaw> extends Annotated<T> {
  public readonly moduleName;
  public readonly builder;
  constructor(raw: T, builder: Root) {
    super(raw);
    this.builder = builder;
    this.moduleName = UniqueName.createFor(
      builder,
      builder.fixClassName(this.name.replace(/^.*?(?=[^.]*$)/, '')),
      builder.uniqueNameSeparator,
    );
  }
}
