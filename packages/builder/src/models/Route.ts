import { Annotated } from './Annotated';
import type { Module } from './Module';
import { Type } from './Type';
import { Dubious, getPureClassName, notEmpty, toLowerCamel, UniqueName } from '../utils';
import { u2a, u2s } from 'u2x';
import { Parameter } from './Parameter';
import { NadRoute } from '../types/nad';
import { RouteConsumes } from './RouteConsumes';
import { HTTP_SERVLET_RESPONSE_SET } from '../constants';

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
  public readonly customFlags;
  public readonly requiredHeaders: [string, string][];
  public readonly requiredParams: [string, string][];
  public readonly deprecated;

  constructor(raw: RouteRaw | undefined, module: Module) {
    super(raw);
    this.module = module;
    this.builder = this.module.builder;

    // The POST is the best method in HTTP (while this conclusion may sound hasty, it is the case), because:
    // 1. Some platforms can only support GET and POST, such as Alipay MiniProgram, and so on.
    // 2. Compared to GET method, the POST method can take payload.
    // Therefore, use the POST method as the first preferred option in case the route supports it.
    // Otherwise use the first method in the supported list.
    const methods = u2a(this.raw.methods, u2s).filter(notEmpty);
    if (methods.length > 0 && !methods.includes('POST')) this.method = methods[0];
    else this.method = 'POST';

    this.pattern = u2a(this.raw.patterns, u2s).filter(notEmpty)[0] || '';

    this.customFlags = u2a(this.raw.customFlags, u2s).filter(notEmpty);

    // If a void method parameter contains HttpServletResponse, the return type is problely a free type.
    if (
      this.raw.returnType === 'void' &&
      u2a(this.raw.parameters, (u) => u2s(u.type)).some((n) => n && HTTP_SERVLET_RESPONSE_SET.has(n))
    ) {
      this.returnType = Type.create('?', this.builder);
    } else {
      this.returnType = Type.create(u2s(this.raw.returnType), this.builder);
    }

    this.parameters = u2a(this.raw.parameters, (i) => Parameter.create(i, this)).filter(notEmpty);
    this.description = this.annotations.swagger.getApiOperation()?.description || '';
    this.deprecated = this.annotations.hasDeprecated();

    this.requiredHeaders = [];
    this.requiredParams = [];

    const requestContentType = new RouteConsumes(this.raw.consumes).getTheBest();
    if (requestContentType) {
      this.requiredHeaders.push(['Content-Type', requestContentType]);
    }
    const requestMapping = this.annotations.web.getRequestMapping();
    if (requestMapping) {
      for (const i of requestMapping.headers) {
        if (i.negative) continue;
        this.requiredHeaders.push([i.key, i.value]);
      }
      for (const i of requestMapping.params) {
        if (i.negative) continue;
        this.requiredParams.push([i.key, i.value]);
      }
    }

    {
      const { builder, module, name, parameters } = this;
      const { options, uniqueNameSeparator } = builder;
      let uniqName = options.fixApiName(toLowerCamel(name));
      // If a java method is overrided, concat all parameter type names to the name prefix.
      if (UniqueName.lookupFor(module, uniqName) && parameters.length) {
        uniqName += 'By' + parameters.map((p) => getPureClassName(p.type.name)).join('And');
      }
      this.uniqName = UniqueName.createFor(module, uniqName, uniqueNameSeparator);
    }
  }
}
