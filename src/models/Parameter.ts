import { u2o, u2s } from '../utils';
import type { Root } from './Root';
import { Annotated } from './Annotated';
import { Type } from './Type';
import { isJavaNonClass } from '../helpers/javaHelper';

const ignoredTypes = new Set([
  'javax.servlet.http.HttpServletRequest',
  'javax.servlet.http.HttpServletResponse',
  'org.springframework.http.HttpEntity',
]);

export class Parameter extends Annotated {
  static create(raw: unknown, builder: Root) {
    const { type } = u2o(raw);
    if (typeof type === 'string' && ignoredTypes.has(type.replace(/<.*/, ''))) return null;
    return new Parameter(raw, builder);
  }
  public readonly type;
  public readonly builder;
  public readonly required;
  public readonly actions;
  public readonly description;
  constructor(raw: unknown, builder: Root) {
    super(raw);
    this.builder = builder;
    this.type = Type.create(u2s(this.raw.type), builder);
    this.description = this.annotations.swagger.getApiParam()?.description || '';
    const pv = this.annotations.web.getPathVariable();
    const rp = this.annotations.web.getRequestParam();
    const rb = this.annotations.web.getRequestBody();
    this.required = rp?.required || pv?.required || rb?.required ? ('' as const) : ('?' as const);
    this.actions = [] as [string, ...string[]][];
    const isFile = this.type.name === 'org.springframework.web.multipart.MultipartFile';
    if (pv) this.actions.push(['addPathVariable', pv.value || this.name]);
    if (rb) this.actions.push(['addRequestBody']);
    if (rp) {
      if (isFile) {
        this.actions.push(['addMultipartFile', rp.value || this.name]);
      } else {
        this.actions.push(['addRequestParam', rp.value || this.name]);
      }
    } else if (!pv && !rb) {
      if (isJavaNonClass(this.type.name)) {
        if (isFile) {
          this.actions.push(['addMultipartFile', this.name]);
        } else {
          this.actions.push(['addRequestParam', this.name]);
        }
      } else {
        this.actions.push(['addNormalParam']);
      }
    }
  }
}
