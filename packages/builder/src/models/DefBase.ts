import { AnnocatedRaw, Annotated } from './Annotated';
import type { Root } from './Root';

export class DefBase<T extends AnnocatedRaw = AnnocatedRaw> extends Annotated<T> {
  public readonly simpleName;
  public readonly builder;
  public get options() {
    return this.builder.options;
  }
  constructor(raw: T, builder: Root) {
    super(raw);
    this.builder = builder;
    this.simpleName = builder.takeUniqueName(this.name, this.options.fixClassName);
  }
}
