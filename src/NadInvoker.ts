import { InvokeResult, request } from '@huolala-tech/request';
import { WWW_FORM_URLENCODED } from './constants';
import { HttpError } from './errors/HttpError';
import { ObjectNestingTooDeepError } from './errors/ObjectNestingTooDeepError';
import { isNonNullObject } from './utils/isNonNullObject';
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

  /**
   * Defined by RequestParam
   * @param param A non-null object
   */
  public addModelAttribute(param: unknown, path: string[] = []) {
    if (!isNonNullObject(param)) return this;
    if (param instanceof Array) return this;

    // If the `param` references itself, this code could enter an endless recursive call.
    // The next line provides a defensive breaking point.
    if (path.length > 32) throw new ObjectNestingTooDeepError();

    Object.keys(param).forEach((key) => {
      const item = param[key];
      const nextPath = path.concat(key);
      const name = nextPath.join('.');
      if (!isNonNullObject(item) || item instanceof Array) {
        // Spring Web only supports plain types as list items.
        // Therefore, if the item is an array, we do not have to care its item type, simply call addRequestParam.
        this.addRequestParam(name, item);
      } else {
        this.addModelAttribute(item, nextPath);
      }
    });
    return this;
  }

  /**
   * @deprecated Use the addModelAttribute method instead.
   */
  public addNormalParam(param: unknown) {
    return this.addModelAttribute(param);
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
    const qs = this.buildQs();
    let url = this.buildBasePath();
    if (qs) url += `?${qs}`;
    return url;
  }

  private buildBasePath() {
    const { rawPath, settings } = this;
    // Find all {...} expression in the path, and replace them with values from pathVariables.
    const path = rawPath.replace(/\{(.*?)\}/g, (_, key) => encodeURIComponent(String(this.pathVariables[key])));
    const base = settings?.base ?? this.base ?? '';
    return joinPath(base, path);
  }

  // NOTE: Do not use async/await in this libraray, as it may generate some iterator polyfill code in ES5.
  public execute() {
    const { method, settings, body, files, extensions } = this;
    const { timeout } = settings || {};
    const headers = { ...this.headers, ...settings?.headers };
    const { postHandler } = NadInvoker;
    const contentType = findHeader(headers, 'Content-Type');

    /**
     * PRINCIPLE: Make the HTTP header as light as possible.
     * Spring Web supports reading certain parameters from either QueryString or FormData (Note: The FormData does not include JSON).
     * Whenever possible, we should send our parameters with FormData.
     * The following are the POSSIBLE conditions:
     * 1. The HTTP method used must support sending payloads (POST, and PUT, and PATCH methods).
     * 2. No custom body can be provided as it may conflict with other parameters.
     * 3. The request's Content-Type must be empty or FormData. If it's empty, it can be changed to FormData.
     */
    if (canTakePayload(method) && !body && supportFormData(contentType)) {
      const url = this.buildBasePath();
      const data = this.requestParams;
      const hasFile = Object.keys(files).length;
      // If the `files` is not empty, keep the Content-Type header empty, as it will be automatically set by the request library.
      if (!contentType && !hasFile) headers['Content-Type'] = WWW_FORM_URLENCODED;
      return request<T>({ method, url, timeout, headers, data, files, ...extensions }).then(postHandler);
    } else {
      const url = this.buildUrl();
      return request<T>({ method, url, timeout, headers, data: Object(body), files, ...extensions }).then(postHandler);
    }
  }

  public static postHandler<T>(res: InvokeResult<T>) {
    const { data, statusCode } = res;
    if (statusCode >= 200 && statusCode < 300) return data;
    throw new HttpError(res);
  }
}

const isMultipartFormData = (mediaType: string) => /^multipart\/form-data(?:\s*;|$)/.test(mediaType);
const isWwwFormUrlEncoded = (mediaType: string) => /^application\/x-www-form-urlencoded(?:\s*;|$)/.test(mediaType);

const findHeader = (headers: Record<string, string>, name: string) => {
  const keys = Object.keys(headers);
  const ln = name.toLowerCase();
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].toLowerCase() === ln) return headers[keys[i]];
  }
  return null;
};

const supportFormData = (mediaType: string | null) =>
  !mediaType || isMultipartFormData(mediaType) || isWwwFormUrlEncoded(mediaType);

const canTakePayload = (method: string) => {
  const u = method.toUpperCase();
  return u === 'POST' || u === 'PUT' || u === 'PATCH';
};
