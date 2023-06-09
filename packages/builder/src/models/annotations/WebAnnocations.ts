import { Annotations } from '.';
import { u2b } from '../../utils';
import { AnnotationBase } from './AnnotationBase';
import { u2s } from '../../utils';

abstract class ValueAliasName extends AnnotationBase<string> {
  get value(): string {
    return u2s(this.raw.name || this.raw.value);
  }
}

/**
 * @see https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/RequestParam.html
 */
export class RequestParam extends ValueAliasName {
  public static iface = 'org.springframework.web.bind.annotation.RequestParam';
  get required() {
    return u2b(this.raw.required, true);
  }
}

/**
 * @see https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/PathVariable.html
 */
export class PathVariable extends ValueAliasName {
  public static iface = 'org.springframework.web.bind.annotation.PathVariable';
  get required() {
    return u2b(this.raw.required, true);
  }
}

/**
 * @see https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/RequestBody.html
 */
export class RequestBody extends ValueAliasName {
  public static iface = 'org.springframework.web.bind.annotation.RequestBody';
  get required() {
    return u2b(this.raw.required, true);
  }
}

/**
 * @see https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/ModelAttribute.html
 */
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
