import { Annotated } from './Annotated';
import type { Module } from './Module';
import { Type } from './Type';
import { Dubious, notEmpty } from '../utils';
import { u2a, u2s } from '../utils';
import { UniqueName } from './UniqueName';
import { Parameter } from './Parameter';
import { NadRoute } from '../types/nad';
import { RouteConsumes } from './RouteConsumes';

export type RouteRaw = Dubious<NadRoute>;

export class Route extends Annotated<RouteRaw> {
  public readonly module;
  public readonly builder;
  public readonly uniqName;

  public readonly returnType;
  public readonly parameters;
  public readonly description;

  public readonly method;
  public readonly pattern;
  public readonly requestContentType;

  constructor(raw: RouteRaw | undefined, module: Module) {
    super(raw);
    this.module = module;
    this.builder = this.module.builder;
    this.uniqName = UniqueName.createFor(
      this.module,
      this.builder.fixApiName(this.name),
      this.builder.uniqueNameSeparator,
    );

    const methods = u2a(this.raw.methods, u2s);
    if (methods.includes('POST')) this.method = 'POST';
    else if (methods.length > 0) this.method = methods[0];
    else this.method = 'POST';

    this.pattern = u2a(this.raw.patterns, u2s)[0] || '';

    this.requestContentType = new RouteConsumes(this.raw.consumes).getTheBest();

    this.returnType = Type.create(u2s(this.raw.returnType), this.builder);
    this.parameters = u2a(this.raw.parameters, (i) => Parameter.create(i, this)).filter(notEmpty);
    this.description = this.annotations.swagger.getApiOperation()?.description || '';
  }
}
