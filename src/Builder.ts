import { RawDefs, Root } from './models';
import { CodeGenForOc, CodeGenForTs } from './codegen';
import { ocBuilderOptions } from './helpers/ocHelper';
import { tsBuilderOptions } from './helpers/tsHelper';

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
}

export class Builder {
  public readonly target;
  public readonly defs;
  public readonly base;
  public readonly apis;
  public readonly runtimePkgName;

  constructor({ target, defs, base, apis, runtimePkgName = '@huolala-tech/nad-runtime' }: BuilderParams) {
    this.target = target;
    this.defs = defs;
    this.base = base;
    this.apis = apis;
    this.runtimePkgName = runtimePkgName;
  }

  /**
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
    } else throw new TypeError(`Invalid target "${target}"`);
    Object.defineProperty(this, 'root', { configurable: true, value });
    return value;
  }

  /**
   * It's generated lazily, only when it is actually used.
   */
  get code() {
    const { root, target, base, defs, runtimePkgName } = this;
    let value;
    if (target === 'oc') {
      value = new CodeGenForOc(root, { base }).toString();
    } else if (target === 'ts') {
      value = new CodeGenForTs(root, { base, runtimePkgName }).toString();
    } else if (target === 'raw') {
      value = JSON.stringify(defs, null, 2);
    } else throw new TypeError(`Invalid target "${target}"`);
    Object.defineProperty(this, 'code', { configurable: true, value });
    return value;
  }
}
