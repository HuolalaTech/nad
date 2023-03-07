import { Annotations } from '.';
import { toBoolean } from '../../utils';
import { AnnotationBase } from './AnnotationBase';
import { toString } from '../../utils';

export class ValueAliasName extends AnnotationBase<string> {
  get value(): string {
    return toString(this.raw.name || this.raw.value);
  }
}

export class RequestParam extends ValueAliasName {
  get required() {
    return toBoolean(this.raw.required, true);
  }
}

export class PathVariable extends ValueAliasName {
  get required() {
    return toBoolean(this.raw.required, true);
  }
}

export class RequestBody extends ValueAliasName {
  get required() {
    return toBoolean(this.raw.required, true);
  }
}

export class WebAnnotations {
  private annotations;
  constructor(annotations: Annotations) {
    this.annotations = annotations;
  }

  getRequestBody() {
    return RequestBody.create(this.annotations, 'org.springframework.web.bind.annotation.RequestBody');
  }
  getRequestParam() {
    return RequestParam.create(this.annotations, 'org.springframework.web.bind.annotation.RequestParam');
  }
  getPathVariable() {
    return PathVariable.create(this.annotations, 'org.springframework.web.bind.annotation.PathVariable');
  }
}
