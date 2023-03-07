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

  getJSONField() {
    return this.annotations.find<JSONField>('com.alibaba.fastjson.annotation.JSONField');
  }
  getJsonProperty() {
    return this.annotations.find<JsonProperty>('com.fasterxml.jackson.annotation.JsonProperty');
  }
  getJsonIgnore() {
    return this.annotations.find<JsonIgnore>('com.fasterxml.jackson.annotation.JsonIgnore');
  }
}
