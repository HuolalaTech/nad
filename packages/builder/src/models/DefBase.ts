import { hideProperty } from '../utils';
import { AnnocatedRaw, Annotated } from './Annotated';
import type { Root } from './Root';

export class DefBase<T extends AnnocatedRaw = AnnocatedRaw> extends Annotated<T> {
  public readonly root;
  public get options() {
    return this.root.options;
  }
  constructor(raw: T, root: Root) {
    super(raw);
    this.root = root;
    hideProperty(this, 'root');
    hideProperty(this, 'root');
  }

  public get simpleName() {
    const value = this.root.takeUniqueName(this.name, this.options.fixClassName);
    Object.defineProperty(this, 'simpleName', { configurable: true, value });
    return value;
  }
}
