import { Annotations } from '.';

export interface JsonProperty {
  value: string;
  required: boolean;
  index: number;
}

export interface JsonIgnore {
  value: boolean;
}

export interface JSONField {
  name: string;
  serialize: boolean;
}

export interface JsonNaming {
  value: string;
}

export class JsonAnnotations {
  private annotations;
  constructor(annotations: Annotations) {
    this.annotations = annotations;
  }

  public get alias() {
    return this.getJsonProperty()?.value || this.getJSONField()?.name;
  }

  public get isIgnored() {
    return this.getJsonIgnore()?.value === true || this.getJSONField()?.serialize === false;
  }

  public get needToSnake() {
    return this.getJsonNaming()?.value === 'com.fasterxml.jackson.databind.PropertyNamingStrategy$SnakeCaseStrategy';
  }

  private getJsonProperty() {
    return this.annotations.find<JsonProperty>('com.fasterxml.jackson.annotation.JsonProperty');
  }

  private getJsonIgnore() {
    return this.annotations.find<JsonIgnore>('com.fasterxml.jackson.annotation.JsonIgnore');
  }

  private getJSONField() {
    return this.annotations.find<JSONField>('com.alibaba.fastjson.annotation.JSONField');
  }

  private getJsonNaming() {
    return this.annotations.find<JsonNaming>('com.fasterxml.jackson.databind.annotation.JsonNaming');
  }
}
