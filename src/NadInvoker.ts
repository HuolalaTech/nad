import { request } from '@huolala-tech/request';
import { HttpError } from './errors/HttpError';
import { joinPath } from './utils/joinPath';

export interface Settings {
  timeout?: number;
  headers?: Record<string, string>;
  base?: string;
}

type MultipartFile = Blob | File | string;

export class NadInvoker<T> {
  public base;
  public rawPath: string;
  public method: string;
  public settings?: Partial<Settings>;
  public body?: unknown;

  protected readonly requestParams: Record<string, unknown>;
  protected readonly pathVariables: Record<string, unknown>;
  protected readonly files: Record<string, MultipartFile>;
  protected readonly extensions: Record<string, unknown>;
  protected readonly headers: Record<string, string>;

  constructor(base?: string) {
    this.base = base;
    this.rawPath = '/';
    this.method = 'GET';
    this.pathVariables = Object.create(null);
    this.requestParams = Object.create(null);
    this.files = Object.create(null);
    this.headers = Object.create(null);
    this.extensions = Object.create(null);
  }

  public open(method: string, rawPath: string, settings?: Partial<Settings>) {
    this.method = method;
    this.rawPath = rawPath;
    this.settings = settings;
    return this;
  }

  public addRequestBody(body: unknown) {
    this.body = body;
    return this;
  }

  public addPathVariable(key: string, value: unknown) {
    this.pathVariables[key] = value;
    return this;
  }

  public addRequestParam(key: string, value: unknown) {
    if (value === undefined) {
      delete this.requestParams[key];
    } else {
      this.requestParams[key] = value;
    }
    return this;
  }

  public addNormalParam(param: unknown) {
    const obj = Object(param);
    Object.keys(obj).forEach((key) => {
      this.addRequestParam(key, obj[key]);
    });
    return this;
  }

  public addMultipartFile(key: string, value?: MultipartFile | null | undefined) {
    if (value === null || value === undefined) {
      delete this.files[key];
    } else {
      this.files[key] = value;
    }
    return this;
  }

  public addExtension(key: string, value: unknown) {
    this.extensions[key] = value;
    return this;
  }

  public addHeader(key: string, value: string) {
    this.headers[key] = value;
    return this;
  }

  protected buildQs() {
    const { requestParams } = this;
    return Object.keys(requestParams)
      .map((name) =>
        []
          // The requestParams[name] may or may not be an array, [].concat ensures it is always an array.
          // For array value, the query string builder should separate it and append each item one by one.
          // For example, if the requestParams is { a: [ 1, 2, 3 ] }, the qs should be "a=1&a=2&a=3".
          .concat(requestParams[name] as unknown as never)
          .map((v) => `${encodeURIComponent(name)}=${encodeURIComponent(v)}`)
          .join('&'),
      )
      .join('&');
  }

  protected buildUrl() {
    const { rawPath, settings } = this;
    // Find all {...} expression in the path, and replace them with values from pathVariables.
    const path = rawPath.replace(/\{(.*?)\}/g, (_, key) => encodeURIComponent(String(this.pathVariables[key])));
    const qs = this.buildQs();
    const base = settings?.base ?? this.base ?? '';
    let url = joinPath(base, path);
    if (qs) url += `?${qs}`;
    return url;
  }

  public execute() {
    const { method, settings, body, files, extensions } = this;
    const url = this.buildUrl();
    const { timeout } = settings || {};
    const headers = { ...this.headers, ...settings?.headers };
    // NOTE: Do not use async/await in this libraray, as it may generate some iterator polyfill code in ES5.
    return request<T>({ method, url, timeout, headers, data: Object(body), files, ...extensions }).then((res) => {
      const { data, statusCode } = res;
      if (statusCode >= 200 && statusCode < 300) return data;
      throw new HttpError(res);
    });
  }
}
