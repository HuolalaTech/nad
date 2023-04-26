import { InvokeParams, InvokeResult, WWW_FORM_URLENCODED, request } from '@huolala-tech/request';
import { HttpError } from './errors/HttpError';
import { ObjectNestingTooDeepError } from './errors';
import { joinPath } from './utils/joinPath';
import { insensitiveGet } from './utils/insensitiveGet';
import { isSupportingPayload, isForm, isNonNullObject } from './utils/predicates';

export interface Settings {
  timeout?: number;
  headers?: Record<string, string>;
  base?: string;
}

type MultipartFile = Blob | File | string;

export class NadInvoker<T> {
  /**
   * The base URI of the HTTP request.
   */
  public base;

  /**
   * The raw path that may contain certain placeholders in the style of Spring Web.
   */
  public rawPath: string;

  /**
   * The method of the HTTP request.
   */
  public method: string;

  /**
   * The custom body of the HTTP request.
   */
  public body?: unknown;

  /**
   * The advanced settings of the HTTP request.
   */
  public settings?: Partial<Settings>;

  protected readonly requestParams: Record<string, unknown>;
  protected readonly pathVariables: Record<string, unknown>;
  protected readonly files: Record<string, MultipartFile>;
  protected readonly extensions: Record<string, unknown>;
  protected readonly headers: Record<string, string>;

  /**
   * Create a new instance of NadInvoker with a base URI for the API.
   * @param base The base URI for the API.
   */
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

  /**
   * Configure certain necessary parameters.
   * @param method The HTTP method.
   * @param rawPath The raw path, that could contain variable templates such as "/api/users/{id}".
   * @param settings Other settings.
   */
  public open(method: string, rawPath: string, settings?: Partial<Settings>) {
    this.method = method;
    this.rawPath = rawPath;
    this.settings = settings;
    return this;
  }

  /**
   * Set a request body, that maps to a Java method parameter which annotated with "@RequestBody".
   * NOTE: Use the last value, if this method is called multiple times.
   * @param body A serializable object.
   */
  public addRequestBody(body: unknown) {
    this.body = body;
    return this;
  }

  /**
   * Replace the variable template in the raw path with the real value.
   * In Java code, a parameter which annotated with "@PathVariable" will receive this value.
   * NOTE: The value will be encoded as URL encoding.
   * NOTE: Use the last value, if this method is called mutiple times with same key.
   * @param key The variable template name in raw path.
   * @param value The real value. Normally, the value should be a string because the HTTP path is also a string.
   *              However, you can present any type here, it will be converted to a string with the JavaScript implicit
   *              conversion rules.
   */
  public addPathVariable(key: string, value: unknown) {
    this.pathVariables[key] = value;
    return this;
  }

  /**
   * In Java code, some parameters may be annotated with "@RequestParam".
   * This method set some key-value pairs, that finally map with Java parameters.
   * NOTE: These data will be sent with either HTTP query string or payload.
   *       The specific rules are complex and will not be expended here.
   * NOTE: Use the last value, if this method is called mutiple times with same key.
   * @param key The variable name.
   * @param value The value.
   */
  public addRequestParam(key: string, value: unknown) {
    if (value === undefined) {
      delete this.requestParams[key];
    } else {
      this.requestParams[key] = value;
    }
    return this;
  }

  /**
   * In Java code, some parameters may be annotated with "@ModelAttribute".
   * This method set an object, that will map with Java parameters.
   * NOTE: These data will be sent with either HTTP query string or payload.
   *       The specific rules are complex and will not be expended here.
   * @param param A non-null object.
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
   * In Java code, certain parameters may be of the MultipartFile type, which expect to receive a file.
   * This method is used to associate a file object with the key.
   * NOTE: If this method was called, the request Content-Type will be set to "multipart/form-data".
   * NOTE: Use the last value, if this method is called mutiple times with same key.
   * @param key The field name.
   * @param file A file with a type of either Blob (File extends Blob), or string.
   *             NOTE: In MiniProgram, it is should be a string representing the temporary path.
   */
  public addMultipartFile(key: string, file?: MultipartFile | null | undefined) {
    if (file === null || file === undefined) {
      delete this.files[key];
    } else {
      this.files[key] = file;
    }
    return this;
  }

  /**
   * The method allows the upper layer application to pass some additional fields to the underlying network library.
   * NOTE: Use the last value, if this method is called mutiple times with same name.
   * @param name The additional field name.
   * @param value The field value.
   */
  public addExtension(name: string, value: unknown) {
    this.extensions[name] = value;
    return this;
  }

  /**
   * Add a custom request header (HTTP header).
   * NOTE: Use the last value, if this method is called mutiple times with same name.
   * @param name The header name.
   * @param value The value.
   */
  public addHeader(key: string, value: string) {
    this.headers[key] = value;
    return this;
  }

  /**
   * Build a query string based on the `requestParams`.
   * NOTE: This is a stateless method that simply builds a string without concerning how it will be sent.
   * NOTE: If a value is an array, each value will be joined with same key.
   *       For instance, the object { a: [ 1, 2 ] } will results in "a=1&a=2".
   */
  protected buildQs() {
    const { requestParams } = this;
    return Object.keys(requestParams)
      .map((name) =>
        []
          // The requestParams[name] may or may not be an array, [].concat ensures it is always an array.
          // For array value, the query string builder should separate it and append each item one by one.
          // For example, if the requestParams is { a: [ 1, 2 ] }, the qs should be "a=1&a=2".
          .concat(requestParams[name] as unknown as never)
          .map((v) => `${encodeURIComponent(name)}=${encodeURIComponent(v)}`)
          .join('&'),
      )
      .join('&');
  }

  /**
   * Build a URL string (includes query string).
   * NOTE: This is a stateless method that simply builds a string without concerning how it will be used.
   */
  protected buildUrl() {
    const qs = this.buildQs();
    let url = this.buildBasePath();
    if (qs) url += `?${qs}`;
    return url;
  }

  /**
   * Build the base string (excluding the query string).
   * This method joins the base and path, where the path is the result of filling the `pathVariables` into
   * placeholders in the `rawPath`.
   * NOTE: The base value is attempted to be read from the settings, and from the instance as a fallback option.
   */
  private buildBasePath() {
    const { rawPath, settings } = this;
    // Find all {...} expression in the path, and replace them with values from pathVariables.
    const path = rawPath.replace(/\{(.*?)\}/g, (_, key) => encodeURIComponent(String(this.pathVariables[key])));
    const base = settings?.base ?? this.base ?? '';
    return joinPath(base, path);
  }

  /**
   * Actually execute this request.
   */
  public execute() {
    const { method, settings, body, files, extensions, constructor } = this;
    const { timeout } = settings || {};
    const headers = { ...this.headers, ...settings?.headers };

    // Get the static methods from the current constructor that may be overridden by the derived class.
    const { postHandler, request } = constructor as typeof NadInvoker;

    const contentType = insensitiveGet(headers, 'Content-Type');

    /**
     * PRINCIPLE: Make the HTTP header as light as possible.
     * Spring Web supports reading certain parameters from either QueryString or Form.
     * Note: The Form includes only MULTIPART_FORM_DATA and WWW_FORM_URLENCODED.
     * Whenever possible, we should send our parameters with FormData.
     * The following are the POSSIBLE conditions:
     * 1. The HTTP method used must support sending payloads (POST, and PUT, and PATCH methods).
     * 2. No custom body can be provided as it may conflict with other parameters.
     * 3. The request's Content-Type must be empty or Form. If it's empty, it can be changed to FormData.
     */
    if (isSupportingPayload(method) && !body && isForm(contentType)) {
      const url = this.buildBasePath();
      const data = this.requestParams;
      const hasFile = Object.keys(files).length;
      // If the `files` is not empty, keep the Content-Type header empty, as it will be set by the request library.
      if (!contentType && !hasFile) headers['Content-Type'] = WWW_FORM_URLENCODED;
      return request<T>({ method, url, timeout, headers, data, files, ...extensions }).then(postHandler);
    } else {
      const url = this.buildUrl();
      return request<T>({ method, url, timeout, headers, data: Object(body), files, ...extensions }).then(postHandler);
    }
  }

  /**
   * To call the network library.
   * For the ease of overriding, this method is defined as static.
   */
  public static request<T>(options: InvokeParams) {
    return request<T>(options);
  }

  /**
   * To handle the raw HTTP response object from the underlying network library.
   * For the ease of overriding, this method is defined as static.
   */
  public static postHandler<T>(res: InvokeResult<T>) {
    const { data, statusCode } = res;
    if (statusCode >= 200 && statusCode < 300) return data;
    throw new HttpError(res);
  }
}
