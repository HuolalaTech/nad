import { request } from '@huolala-tech/request';
import { HttpError } from './exceptions/HttpError';
import { joinPath } from './utils/joinPath';

export interface Settings {
  timeout?: number;
  headers?: Record<string, string>;
  base?: string;
}

type MultipartFile = Blob | File | string;

export class NadInvoker<T> {
  public base;
  public rawUrl: string;
  public method: string;
  public settings?: Partial<Settings>;
  public body?: unknown;

  protected readonly requestParams: Record<string, unknown>;
  protected readonly pathVariables: Record<string, unknown>;
  protected readonly files: Record<string, MultipartFile>;
  protected readonly extensions: Record<string, unknown>;

  constructor(base: string) {
    this.base = base;
    this.rawUrl = '/';
    this.method = 'GET';
    this.pathVariables = Object.create(null);
    this.requestParams = Object.create(null);
    this.files = Object.create(null);
    this.extensions = Object.create(null);
  }

  public open(method: string, rawUrl: string, settings?: Partial<Settings>) {
    this.method = method;
    this.rawUrl = rawUrl;
    this.settings = settings;
    return this;
  }

  public addRequestBody(body: unknown) {
    this.body = body;
    return this;
  }

  public addPathVariable(key: string, value: unknown) {
    if (key in this.pathVariables) return this;
    this.pathVariables[key] = value;
    return this;
  }

  public addRequestParam(key: string, value: unknown) {
    if (key in this.requestParams || value === undefined) return this;
    this.requestParams[key] = value;
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
    if (key in this.files || value === null || value === undefined) return this;
    this.files[key] = value;
    return this;
  }

  public addExtension(key: string, value: unknown) {
    if (key in this.extensions) return this;
    this.extensions[key] = value;
    return this;
  }

  protected buildQs() {
    const { requestParams } = this;
    return Object.keys(requestParams)
      .map((name) =>
        []
          .concat(requestParams[name] as unknown as never)
          .map((v) => `${encodeURIComponent(name)}=${encodeURIComponent(v)}`)
          .join('&'),
      )
      .join('&');
  }

  protected buildUrl() {
    const { rawUrl, settings } = this;
    const path = rawUrl.replace(/\{(.*?)\}/g, (_, key) => encodeURIComponent(String(this.pathVariables[key])));
    const qs = this.buildQs();
    const base = settings?.base || this.base || '';
    let url = joinPath(base, path);
    if (qs) url += `?${qs}`;
    return url;
  }

  public execute() {
    const { method, settings, body, files, extensions } = this;
    const url = this.buildUrl();
    const { headers, timeout } = settings || {};
    return request<T>({ method, url, timeout, headers, data: Object(body), files, ...extensions }).then(
      ({ data, statusCode }) => {
        if (statusCode === 200) return data;
        throw new HttpError(statusCode);
      },
    );
  }
}
