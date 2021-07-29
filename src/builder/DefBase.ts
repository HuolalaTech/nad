import { Annotated } from './Annotated';
import type { Builder } from './Builder';
import { UniqueName } from './UniqueName';

export class DefBase extends Annotated {
  public readonly simpleName;
  public readonly builder;
  constructor(raw: unknown, builder: Builder) {
    super(raw);
    this.builder = builder;
    this.simpleName = UniqueName.createFor(
      builder,
      builder.fixClassName(this.name.replace(/^.*?(?=[^.]*$)/, '')),
      builder.uniqueNameSeparator,
    );
  }
}
