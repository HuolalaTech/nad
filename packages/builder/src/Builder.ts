import { RawDefs, Root } from './models';
import { CodeGenForOc, CodeGenForTs } from './codegen';
import { ocBuilderOptions } from './helpers/ocHelper';
import { tsBuilderOptions } from './helpers/tsHelper';
import { neverReachHere } from './utils';

export const supportedTargets = ['ts', 'oc', 'raw'] as const;
export type SupportedTarget = (typeof supportedTargets)[number];

export interface BuilderParams {
  defs: RawDefs;
  target: SupportedTarget;
  base: string;
  apis?: string[];

  /**
   * TS Only
   */
  runtimePkgName?: string;

  /**
   * TS Only
   */
  properties?: Record<string, string | number>;
}

export class Builder {
  public readonly target;
  public readonly defs;
  public readonly base;
  public readonly apis;
  public readonly runtimePkgName;
  public readonly properties;

  constructor({ target, defs, base, apis, runtimePkgName = '@huolala-tech/nad-runtime', properties }: BuilderParams) {
    this.target = target;
    this.defs = defs;
    this.base = base;
    this.apis = apis;
    this.runtimePkgName = runtimePkgName;
    this.properties = properties;
  }

  /**
   * The tree root object of the AST.
   * It's generated lazily, only when it is actually used.
   */
  get root() {
    const { target, defs, apis } = this;
    let value;
    if (target === 'oc') {
      value = new Root(defs, { ...ocBuilderOptions, apis });
    } else if (target === 'ts') {
      value = new Root(defs, { ...tsBuilderOptions, apis });
    } else if (target === 'raw') {
      value = new Root(defs, { apis: undefined });
    } else throw neverReachHere(target, `Invalid target "${target}"`);
    Object.defineProperty(this, 'root', { configurable: true, value });
    return value;
  }

  /**
   * The generated code.
   * It's generated lazily, only when it is actually used.
   */
  get code() {
    const { target, base, defs, properties, runtimePkgName } = this;
    let value;
    if (target === 'oc') {
      value = new CodeGenForOc(this.root, { base }).toString();
    } else if (target === 'ts') {
      value = new CodeGenForTs(this.root, { base, properties, runtimePkgName }).toString();
    } else if (target === 'raw') {
      value = JSON.stringify(defs, null, 2);
    } else throw neverReachHere(target, `Invalid target "${target}"`);
    Object.defineProperty(this, 'code', { configurable: true, value });
    return value;
  }
}
