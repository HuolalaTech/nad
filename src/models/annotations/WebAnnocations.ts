import { Annotations } from '.';
import { u2b } from '../../utils';
import { AnnotationBase } from './AnnotationBase';
import { u2s } from '../../utils';

export class ValueAliasName extends AnnotationBase<string> {
  public static iface = 'org.springframework.web.bind.annotation.ValueAliasName';
  get value(): string {
    return u2s(this.raw.name || this.raw.value);
  }
}

export class RequestParam extends ValueAliasName {
  public static iface = 'org.springframework.web.bind.annotation.RequestParam';
  get required() {
    return u2b(this.raw.required, true);
  }
}

export class PathVariable extends ValueAliasName {
  public static iface = 'org.springframework.web.bind.annotation.PathVariable';
  get required() {
    return u2b(this.raw.required, true);
  }
}

export class RequestBody extends ValueAliasName {
  public static iface = 'org.springframework.web.bind.annotation.RequestBody';
  get required() {
    return u2b(this.raw.required, true);
  }
}

export class ModelAttribute extends ValueAliasName {
  public static iface = 'org.springframework.web.bind.annotation.ModelAttribute';
}

export class WebAnnotations {
  private annotations;
  constructor(annotations: Annotations) {
    this.annotations = annotations;
  }

  getRequestBody() {
    return RequestBody.create(this.annotations);
  }
  getRequestParam() {
    return RequestParam.create(this.annotations);
  }
  getPathVariable() {
    return PathVariable.create(this.annotations);
  }
  getModelAttribute() {
    return ModelAttribute.create(this.annotations);
  }
}
