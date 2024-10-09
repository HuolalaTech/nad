import { hideProperty, Modifier, notEmpty } from '../utils';
import { u2o, u2s, u2a, u2n } from 'u2x';
import { Root } from './Root';

abstract class RawDef {
  public readonly raw;
  public readonly root;
  public readonly name;
  constructor(raw: unknown, root: Root) {
    this.root = root;
    this.raw = u2o(raw);
    this.name = u2s(this.raw.name) ?? '';
    hideProperty(this, 'raw');
    hideProperty(this, 'root');
  }
}

export class RawClass extends RawDef {
  public readonly superclass;
  public readonly interfaces;
  public readonly modifiers;

  constructor(raw: unknown, root: Root) {
    super(raw, root);
    this.superclass = u2s(this.raw.superclass) ?? null;
    this.interfaces = u2a(this.raw.interfaces, (u) => u2s(u)).filter(notEmpty);
    this.modifiers = u2n(this.raw.modifiers);
  }

  public hasConstructor() {
    const {modifiers} = this;
    if (modifiers === undefined) return true;
    return !Modifier.isAbstract(modifiers) && !Modifier.isInterface(modifiers);
  }

  public use() {
    return this.root.touchClass(this);
  }
}

export class RawEnum extends RawDef {
  constructor(raw: unknown, root: Root) {
    super(raw, root);
  }

  public use() {
    return this.root.touchEnum(this);
  }
}
