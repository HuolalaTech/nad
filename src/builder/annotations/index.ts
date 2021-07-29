import { notEmpty } from '../../utils';
import { PathVariable } from './PathVariable';
import { RequestBody } from './RequestBody';
import { RequestParam } from './RequestParam';

export interface ApiDocField {
  description: string;
  name: string;
  required: boolean;
  example: string;
}

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

export interface NotNull {
  message: string;
}

export interface Max {
  value: number;
  message: string;
}

export interface Min {
  value: number;
  message: string;
}

export interface ApiOperation {
  value: string;
  notes: string;
  tags: string[];
}

export class Annotations {
  private readonly raw;
  constructor(raw: unknown | unknown[]) {
    this.raw = raw instanceof Array ? raw : [];
  }

  getRequestBody() {
    return RequestBody.create(this.find('org.springframework.web.bind.annotation.RequestBody'));
  }
  getRequestParam() {
    return RequestParam.create(this.find('org.springframework.web.bind.annotation.RequestParam'));
  }
  getPathVariable() {
    return PathVariable.create(this.find('org.springframework.web.bind.annotation.PathVariable'));
  }

  getApiOperation() {
    return this.find<ApiOperation>('io.swagger.annotations.ApiOperation');
  }

  getJSONField() {
    return this.find<JSONField>('com.alibaba.fastjson.annotation.JSONField');
  }
  getJsonProperty() {
    return this.find<JsonProperty>('com.fasterxml.jackson.annotation.JsonProperty');
  }
  getJsonIgnore() {
    return this.find<JsonIgnore>('com.fasterxml.jackson.annotation.JsonIgnore');
  }
  getApiDocField() {
    return this.find<ApiDocField>('cn.lalaframework.easyopen.doc.annotation.ApiDocField');
  }

  getNotNull() {
    return this.find<NotNull>('javax.validation.constraints.NotNull');
  }

  getMax() {
    return this.find<Max>('javax.validation.constraints.Max');
  }
  getMin() {
    return this.find<Min>('javax.validation.constraints.Min');
  }

  hasNonNull() {
    return !!this.find<NotNull>('.NonNull', true);
  }

  private readonly cache: Record<string, unknown> = Object.create(null);
  find<T = Record<string, unknown>>(name: string, endsWith = false): T | null {
    const { cache } = this;
    const ck = JSON.stringify([name, endsWith]);
    if (ck in cache) return cache[ck] as T;
    const result = Annotations.find(this.raw, name, endsWith) as T;
    cache[ck] = result;
    return result;
  }

  public toString() {
    return Array.from(Annotations.gen(this.raw), (i) => i.type).join(', ');
  }

  // TODO: list more javax.validation.constraints.*
  static *listPrefix(raw: unknown[], prefix: string) {
    for (const { type, attributes } of this.gen(raw)) {
      if (type.startsWith(prefix)) {
        const name = type.slice(prefix.length);
        const value = Object(attributes) as Record<string, unknown>;
        yield { name, value };
      }
    }
  }

  static find(raw: unknown[], name: string, endsWith = false) {
    for (const { type, attributes } of this.gen(raw)) {
      if (endsWith ? type.endsWith(name) : type === name) {
        return Object(attributes) as Record<string, unknown>;
      }
    }
    return null;
  }

  static *gen(raw: unknown[]) {
    if (raw instanceof Array) {
      for (const i of raw) {
        if (!i) continue;
        const { type, attributes } = Object(i);
        if (typeof type !== 'string') continue;
        yield { type, attributes };
      }
    }
  }

  static create(raw: unknown) {
    return new Annotations(raw);
  }

  static merge(...a: (Annotations | undefined)[]) {
    const raw = a
      .filter(notEmpty)
      .map((i) => i.raw)
      .flat();
    return new Annotations(raw);
  }
}
