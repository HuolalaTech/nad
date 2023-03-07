import { Annotated } from './Annotated';
import type { Module } from './Module';
import { Type } from './Type';
import { notEmpty } from '../utils';
import { toArray, toString } from '../utils';
import { UniqueName } from './UniqueName';
import { Parameter } from './Parameter';

export class Route extends Annotated {
  public readonly module;
  public readonly builder;
  public readonly uniqName;
  public readonly patterns;
  public readonly returnType;
  public readonly parameters;
  public readonly methods;
  public readonly description;

  constructor(raw: unknown, module: Module) {
    super(raw);
    this.module = module;
    this.builder = this.module.builder;
    this.uniqName = UniqueName.createFor(
      this.module,
      this.builder.fixApiName(this.name),
      this.builder.uniqueNameSeparator,
    );
    this.methods = toArray(this.raw?.methods, (i) => toString(i));
    this.patterns = toArray(this.raw?.patterns, (i) => toString(i));
    this.returnType = Type.create(toString(this.raw?.returnType), this.builder);
    this.parameters = toArray(this.raw?.parameters, (i) => Parameter.create(i, this.builder)).filter(notEmpty);
    this.description = this.annotations.swagger.getApiOperation()?.description || '';
  }

  get method() {
    const { methods } = this;
    if (methods.includes('POST')) return 'POST';
    if (methods.length > 0) return methods[0];
    return 'POST';
  }

  get pattern() {
    const { patterns } = this;
    return patterns[0] || '';
  }
}
