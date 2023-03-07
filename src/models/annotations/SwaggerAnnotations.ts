import { Annotations } from '.';
import { AnnotationBase } from './AnnotationBase';

export class Api extends AnnotationBase<string> {
  get tags() {
    return this.raw.tags as string[];
  }
  get hidden() {
    return this.raw.hidden as boolean;
  }
}

export class ApiOperation extends AnnotationBase<string> {
  get description(): string {
    return this.value || '';
  }
  get notes() {
    return this.raw.notes as string;
  }
  get tags() {
    return this.raw.tags as string[];
  }
  get hidden() {
    return this.raw.hidden as boolean;
  }
}

export class ApiModel extends AnnotationBase<string> {
  get description(): string {
    return this.raw.description || this.raw.value || '';
  }
}

export class ApiModelProperty extends AnnotationBase<string> {
  get name() {
    return this.raw.name as string;
  }
  get description(): string {
    return this.raw.value || this.raw.name || '';
  }
  get required() {
    return this.raw.required as boolean;
  }
  get readOnly() {
    return this.raw.readOnly as boolean;
  }
  get hidden() {
    return this.raw.hidden as boolean;
  }
  get position() {
    return this.raw.position as number;
  }
  get allowEmptyValue() {
    return this.raw.allowEmptyValue as boolean;
  }
}

export class ApiParam extends AnnotationBase<string> {
  get name() {
    return this.raw.name as string;
  }
  get description(): string {
    return this.raw.description || this.raw.name || '';
  }
  get required() {
    return this.raw.required as boolean;
  }
  get readOnly() {
    return this.raw.readOnly as boolean;
  }
  get hidden() {
    return this.raw.hidden as boolean;
  }
  get allowMultiple() {
    return this.raw.allowMultiple as boolean;
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
