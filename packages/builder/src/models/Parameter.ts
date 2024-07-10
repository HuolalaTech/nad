import { Dubious } from '../utils';
import { Annotated } from './Annotated';
import { Type } from './Type';
import { isJavaNonClass, isJavaPrimitive } from '../helpers/javaHelper';
import { Route } from './Route';
import { NadParameter } from '../types/nad';
import { u2o, u2s } from 'u2x';
import { HTTP_SERVLET_RESPONSE_SET } from '../constants';

const ignoredTypes = new Set([
  ...HTTP_SERVLET_RESPONSE_SET,
  'javax.servlet.http.HttpServletRequest',
  'jakarta.servlet.http.HttpServletRequest',
  'org.springframework.http.HttpEntity',
]);

export class Parameter extends Annotated<Dubious<NadParameter>> {
  public readonly type;
  public readonly owner;
  public readonly builder;
  public readonly required;
  public readonly actions;
  public readonly description;
  public readonly isFile;
  public readonly hasBody;

  constructor(raw: Dubious<NadParameter> | undefined, owner: Route) {
    super(raw);
    this.owner = owner;
    this.builder = owner.builder;
    this.type = Type.create(u2s(this.raw.type), this.builder);

    const ap = this.annotations.swagger.getApiParam();
    const pv = this.annotations.web.getPathVariable();
    const rb = this.annotations.web.getRequestBody();
    const rp = this.annotations.web.getRequestParam();
    const ma = this.annotations.web.getModelAttribute();
    const rh = this.annotations.web.getRequestHeader();
    const cv = this.annotations.web.getCookieValue();

    this.description = ap?.value || ap?.name || '';

    // A parameter is optional by default, unless any one or more of the following three conditions are met:
    // 1. The "required" option is enabled in any one of known annotations.
    // 2. This parameter has any "NotNull" annotations (contains @NotNull, @NonNull, and @Nonnull).
    // 3. The type of this parameter is a java primitive type.
    this.required =
      (ap?.required ||
        rp?.required ||
        pv?.required ||
        rb?.required ||
        rh?.required ||
        this.annotations.hasNonNull() ||
        isJavaPrimitive(this.type.name)) &&
      // In fact, a parameter can be optional if a default value is provided.
      rp?.defaultValue === undefined
        ? ('' as const)
        : ('?' as const);

    this.actions = [] as [string, ...string[]][];
    this.isFile = this.type.name === 'org.springframework.web.multipart.MultipartFile';
    this.hasBody = !!rb;

    // If a parameter is annotated with `@PathVariable`, the `addPathVariable` method must be called.
    if (pv) this.actions.push(['addPathVariable', pv.value || this.name]);

    // If a parameter is annotated with `@RequestBody`, the `addRequestBody` method must be called.
    if (rb) this.actions.push(['addRequestBody']);

    // If a parameter is annotated with `@RequestParam`, ...
    if (rp) {
      if (this.isFile) {
        this.actions.push(['addMultipartFile', rp.value || this.name]);
      } else {
        this.actions.push(['addRequestParam', rp.value || this.name]);
      }
    }

    // If a parameter is annotated with `@RequestHeader`, ...
    if (rh) this.actions.push(['addHeader', rh.value || this.name]);

    // If a parameter ins annotated with `@ModelAttribute`, the `addModelAttribute` method must be called.
    if (ma) {
      this.actions.push(['addModelAttribute']);
    }

    // If not annotations are present, the method that to be called can be automatically detected.
    if (!pv && !rb && !rp && !ma && !rh && !cv) {
      // For the file upload.
      if (this.isFile) {
        this.actions.push(['addMultipartFile', this.name]);
      }
      // For Java non-class value types.
      else if (isJavaNonClass(this.type.name)) {
        this.actions.push(['addRequestParam', this.name]);
      }
      // For Java classes.
      else {
        this.actions.push(['addModelAttribute']);
      }
    }
  }

  static create(raw: Dubious<NadParameter> | undefined, owner: Route) {
    if (!raw) return null;

    const { type } = u2o(raw);

    // Do not create if matching ignoredTypes.
    if (typeof type === 'string' && ignoredTypes.has(type.replace(/<.*/, ''))) return null;

    const parameter = new Parameter(raw, owner);

    // If the action list is empty, it means that this parameter is not used and should therefore be ignored.
    if (parameter.actions.length === 0) return null;

    return parameter;
  }
}
