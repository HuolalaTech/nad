import { Annotated } from './Annotated';
import type { Module } from './Module';
import { Type } from './Type';
import { Dubious, notEmpty, UniqueName, u2a, u2s } from '../utils';
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
  public readonly customFlags;

  constructor(raw: RouteRaw | undefined, module: Module) {
    super(raw);
    this.module = module;
    this.builder = this.module.builder;
    this.uniqName = UniqueName.createFor(
      this.module,
      this.builder.fixApiName(this.name),
      this.builder.uniqueNameSeparator,
    );

    // The POST is the best method in HTTP (while this conclusion may sound hasty, it is the case), because:
    // 1. Some platforms can only support GET and POST, such as Alipay MiniProgram, and so on.
    // 2. Compared to GET method, the POST method can take payload.
    // Therefore, use the POST method as the first preferred option in case the route supports it.
    // Otherwise use the first method in the supported list.
    const methods = u2a(this.raw.methods, u2s);
    if (methods.length > 0 && !methods.includes('POST')) this.method = methods[0];
    else this.method = 'POST';

    this.pattern = u2a(this.raw.patterns, u2s)[0] || '';

    this.requestContentType = new RouteConsumes(this.raw.consumes).getTheBest();

    this.customFlags = u2a(this.raw.customFlags, u2s);

    this.returnType = Type.create(u2s(this.raw.returnType), this.builder);
    this.parameters = u2a(this.raw.parameters, (i) => Parameter.create(i, this)).filter(notEmpty);
    this.description = this.annotations.swagger.getApiOperation()?.description || '';
  }
}
