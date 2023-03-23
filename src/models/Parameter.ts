import { Dubious, u2o, u2s } from '../utils';
import { Annotated } from './Annotated';
import { Type } from './Type';
import { isJavaNonClass } from '../helpers/javaHelper';
import { Route } from './Route';
import { NadParameter } from '../types/nad';

const ignoredTypes = new Set([
  'javax.servlet.http.HttpServletRequest',
  'javax.servlet.http.HttpServletResponse',
  'org.springframework.http.HttpEntity',
]);

type ParameterRaw = Dubious<NadParameter>;

export class Parameter extends Annotated<ParameterRaw> {
  public readonly type;
  public readonly owner;
  public readonly builder;
  public readonly required;
  public readonly actions;
  public readonly description;
  public readonly isFile;
  public readonly hasBody;

  constructor(raw: ParameterRaw | undefined, owner: Route) {
    super(raw);
    this.owner = owner;
    this.builder = owner.builder;
    this.type = Type.create(u2s(this.raw.type), this.builder);
    this.description = this.annotations.swagger.getApiParam()?.description || '';

    const pv = this.annotations.web.getPathVariable();
    const rp = this.annotations.web.getRequestParam();
    const rb = this.annotations.web.getRequestBody();
    this.required = rp?.required || pv?.required || rb?.required ? ('' as const) : ('?' as const);
    this.actions = [] as [string, ...string[]][];
    this.isFile = this.type.name === 'org.springframework.web.multipart.MultipartFile';
    this.hasBody = !!rb;

    if (pv) this.actions.push(['addPathVariable', pv.value || this.name]);
    if (rb) this.actions.push(['addRequestBody']);
    if (rp) {
      if (this.isFile) {
        this.actions.push(['addMultipartFile', rp.value || this.name]);
      } else {
        this.actions.push(['addRequestParam', rp.value || this.name]);
      }
    } else if (!pv && !rb) {
      if (isJavaNonClass(this.type.name)) {
        if (this.isFile) {
          this.actions.push(['addMultipartFile', this.name]);
        } else {
          this.actions.push(['addRequestParam', this.name]);
        }
      } else {
        this.actions.push(['addNormalParam']);
      }
    }
  }

  static create(raw: ParameterRaw | undefined, owner: Route) {
    const { type } = u2o(raw);
    if (typeof type === 'string' && ignoredTypes.has(type.replace(/<.*/, ''))) return null;
    return new Parameter(raw, owner);
  }
}
