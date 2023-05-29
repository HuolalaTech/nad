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

  private getJsonProperty() {
    return this.annotations.find<JsonProperty>('com.fasterxml.jackson.annotation.JsonProperty');
  }

  private getJsonIgnore() {
    return this.annotations.find<JsonIgnore>('com.fasterxml.jackson.annotation.JsonIgnore');
  }

  private getJSONField() {
    return this.annotations.find<JSONField>('com.alibaba.fastjson.annotation.JSONField');
  }
}
