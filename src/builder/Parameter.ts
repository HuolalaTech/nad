import { toString } from '../utils';
import type { Builder } from './Builder';
import { Annotated } from './Annotated';
import { Type } from './Type';

const ignoredTypes = new Set([
  'javax.servlet.http.HttpServletRequest',
  'javax.servlet.http.HttpServletResponse',
  'org.springframework.http.HttpEntity',
]);

export class Parameter extends Annotated {
  static create(raw: unknown, builder: Builder) {
    const { type } = Object(raw);
    if (typeof type === 'string' && ignoredTypes.has(type.replace(/<.*/, ''))) return null;
    return new Parameter(raw, builder);
  }
  public readonly type;
  public readonly builder;
  public readonly required;
  public readonly actions;
  constructor(raw: unknown, builder: Builder) {
    super(raw);
    this.builder = builder;
    this.type = Type.create(toString(this.raw.type), builder);
    const pv = this.annotations.getPathVariable();
    const rp = this.annotations.getRequestParam();
    const rb = this.annotations.getRequestBody();
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
      if (this.type.isNonClass) {
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
