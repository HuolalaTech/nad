import { u2b, u2s } from '../../utils';
import { Annotations } from '.';
import { AnnotationBase } from './AnnotationBase';

export class Api extends AnnotationBase<string> {
  // get tags() {
  //   return u2a(this.raw.tags, u2s);
  // }
  // get hidden() {
  //   return u2b(this.raw.hidden);
  // }
}

export class ApiOperation extends AnnotationBase<string> {
  get description() {
    return u2s(this.value);
  }
  // get notes() {
  //   return u2s(this.raw.notes);
  // }
  // get tags() {
  //   return u2a(this.raw.tags, u2s);
  // }
  // get hidden() {
  //   return u2b(this.raw.hidden);
  // }
}

export class ApiModel extends AnnotationBase<string> {
  get description(): string {
    return u2s(this.raw.description) || this.value;
  }
}

export class ApiModelProperty extends AnnotationBase<string> {
  get name() {
    return u2s(this.raw.name);
  }
  get description() {
    return this.value || this.name;
  }
  get hidden() {
    return u2b(this.raw.hidden);
  }
  get required() {
    return u2b(this.raw.required);
  }
  // get readOnly() {
  //   return u2b(this.raw.readOnly);
  // }
  // get position() {
  //   return u2n(this.raw.position);
  // }
  // get allowEmptyValue() {
  //   return u2b(this.raw.allowEmptyValue);
  // }
}

/**
 * @see https://docs.swagger.io/swagger-core/v1.5.0/apidocs/io/swagger/annotations/ApiParam.html
 */
export class ApiParam extends AnnotationBase<string> {
  get name() {
    return u2s(this.raw.name);
  }
  get required() {
    return u2b(this.raw.required);
  }
  get defaultValue() {
    return u2s(this.raw.defaultValue);
  }
}

export class SwaggerAnnotations {
  private annotations;
  constructor(annotations: Annotations) {
    this.annotations = annotations;
  }

  getApi() {
    return Api.create(this.annotations, 'io.swagger.annotations.Api');
  }
  getApiOperation() {
    return ApiOperation.create(this.annotations, 'io.swagger.annotations.ApiOperation');
  }
  getApiModel() {
    return ApiModel.create(this.annotations, 'io.swagger.annotations.ApiModel');
  }
  getApiModelProperty() {
    return ApiModelProperty.create(this.annotations, 'io.swagger.annotations.ApiModelProperty');
  }
  getApiParam() {
    return ApiParam.create(this.annotations, 'io.swagger.annotations.ApiParam');
  }
}
