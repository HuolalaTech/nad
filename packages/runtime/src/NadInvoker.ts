import { InvokeParams, InvokeResult, WWW_FORM_URLENCODED, buildQs, request } from '@huolala-tech/request';
import { HttpError } from './errors/HttpError';
import { ObjectNestingTooDeepError } from './errors';
import { joinPath } from './utils/joinPath';
import { insensitiveGet } from './utils/insensitiveGet';
import { isSupportingPayload, isForm, isNonNullObject } from './utils/predicates';
import { NadRuntime, Settings, MultipartFile } from './NadRuntime';
import { buildPath } from './utils/buildPath';
import { setOrDelete } from './utils/setOrDelete';

/**
 * An official implementation of NadRuntime.
 */
export class NadInvoker<T> implements NadRuntime<T> {
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

  protected readonly staticParams: Record<string, unknown>;
  protected readonly requestParams: Record<string, unknown>;
  protected readonly pathVariables: Record<string, unknown>;
  protected readonly files: Record<string, MultipartFile>;
  protected readonly extensions: Record<string, unknown>;
  protected readonly headers: Record<string, string>;
  protected readonly customFlags: string[];

  /**
   * Create a new instance of NadInvoker with a base URI for the API.
   *
   * @param base The base URI for the API.
   * @deprecated
   */
  constructor(base: string);

  /**
   * Create a new instance of NadInvoker with a base URI for the API.
   */
  constructor();

  constructor(base?: string) {
    this.base = base;
    this.rawPath = '/';
    this.method = 'GET';
    this.pathVariables = Object.create(null);
    this.staticParams = Object.create(null);
    this.requestParams = Object.create(null);
    this.files = Object.create(null);
    this.headers = Object.create(null);
    this.extensions = Object.create(null);
    this.customFlags = [];
  }

  /**
   * Configure certain necessary parameters.
   *
   * @param method The HTTP method.
   * @param rawPath The raw path, that could contain variable templates such as "/api/users/{id}".
   * @param settings Other settings.
   * @overload
   */
  public open(method: string, rawPath: string, settings?: Partial<Settings>) {
    this.method = method;
    this.rawPath = rawPath;
    this.settings = settings;
    return this;
  }

  /**
   * Set a request body, that maps to a Java method parameter which annotated with "@RequestBody".
   *
   * NOTE: Use the last value, if this method is called multiple times.
   *
   * @param body A serializable object.
   * @overload
   */
  public addRequestBody(body: unknown) {
    this.body = body;
    return this;
  }

  /**
   * Replace the variable template in the raw path with the real value.
   * In Java code, a parameter which annotated with "@PathVariable" will receive this value.
   *
   * NOTE: The value will be encoded as URL encoding.
   *
   * NOTE: Use the last value, if this method is called mutiple times with same key.
   *
   * @param key The variable template name in raw path.
   * @param value The real value. Normally, the value should be a string because the HTTP path is also a string.
   *              However, you can present any type here, it will be converted to a string with the JavaScript implicit
   *              conversion rules.
   * @overload
   */
  public addPathVariable(key: string, value: unknown) {
    this.pathVariables[key] = value;
    return this;
  }

  /**
   * In Java code, some parameters may be annotated with "@RequestParam".
   * This method set some key-value pairs, that finally map with Java parameters.
   *
   * NOTE: These data will be sent with either HTTP query string or payload.
   *       The specific rules are complex and will not be expended here.
   *
   * NOTE: Use the last value, if this method is called mutiple times with same key.
   *
   * @param key The variable name.
   * @param value The value.
   * @overload
   */
  public addRequestParam(key: string, value: unknown) {
    setOrDelete(this.requestParams, key, value);
    return this;
  }

  /**
   * In Java code, some parameters may be annotated with '@ReqeustMapping(params = "key=value")'.
   * This method set some key-value pairs, that finally map with Java parameters.
   *
   * @param key The key.
   * @param value The value.
   * @overload
   */
  public addStaticParam(key: string, value: unknown) {
    setOrDelete(this.staticParams, key, value);
    return this;
  }

  /**
   * In Java code, some parameters may be annotated with "@ModelAttribute".
   * This method set an object, that will map with Java parameters.
   *
   * NOTE: These data will be sent with either HTTP query string or payload.
   *       The specific rules are complex and will not be expended here.
   *
   * @param param A non-null object.
   * @overload
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
   *
   * NOTE: If this method was called, the request Content-Type will be set to "multipart/form-data".
   *
   * NOTE: Use the last value, if this method is called mutiple times with same key.
   *
   * @param key The field name.
   * @param file A file with a type of either Blob (File extends Blob), or string.
   *
   *             NOTE: In MiniProgram, it is should be a string representing the temporary path.
   * @overload
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
   * Add a custom request header (HTTP header).
   *
   * NOTE: Use the last value, if this method is called mutiple times with same name.
   *
   * @param name The header name.
   * @param value The value.
   * @overload
   */
  public addHeader(key: string, value: string) {
    this.headers[key] = value;
    return this;
  }

  /**
   * Actually execute this request.
   */
  public execute() {
    const { constructor } = this;
    const runtime = constructor as typeof NadInvoker;
    // Get the static methods from the current constructor that may be overridden by the derived class.
    const { postHandler, request } = runtime;
    return request<T>(this.buildInvokeParams()).then(postHandler);
  }

  /**
   * The method allows the upper layer application to pass some additional fields to the underlying network library.
   *
   * NOTE: Use the last value, if this method is called mutiple times with same name.
   *
   * @param name The additional field name.
   * @param value The field value.
   */
  public addExtension(name: string, value: unknown) {
    this.extensions[name] = value;
    return this;
  }

  /**
   * Custom flags, just store them, and do nothing else.
   * Custom implementation can use this flags to handler some special logic.
   *
   * @param flags Some custom flags.
   */
  public addCustomFlags(...flags: string[]): this {
    this.customFlags.push(...flags);
    return this;
  }

  private buildInvokeParams = () => {
    const {
      method,
      settings,
      requestParams,
      staticParams,
      body,
      files,
      extensions,
      constructor,
      rawPath,
      pathVariables,
    } = this;
    const runtime = constructor as typeof NadInvoker;

    // Get the "timeout" value, the priority order is 1-settings, 2-runtime.
    //
    // Note: The runtime config is a global settings is low priority.
    //
    const timeout = settings?.timeout ?? runtime.timeout;
    const base = settings?.base ?? this.base ?? runtime.base ?? '';

    // Get the "headers" value.
    //
    // NOTE: All headers will be merged, the priority order is 1-settings, 2-this, 3-runtime.
    //
    const headers = { ...runtime.headers, ...this.headers, ...settings?.headers };

    const contentType = insensitiveGet(headers, 'Content-Type');

    const uri = joinPath(base, buildPath(rawPath, pathVariables));

    /**
     * PRINCIPLE: Make the HTTP header as light as possible.
     *
     * Spring Web supports reading certain parameters from either QueryString or Form.
     *
     * Note: The Form includes only MULTIPART_FORM_DATA and WWW_FORM_URLENCODED.
     *
     * Whenever possible, we should send our parameters with FormData.
     * The following are the POSSIBLE conditions:
     *
     * 1. The HTTP method used must support sending payloads (POST, and PUT, and PATCH methods).
     * 2. No custom body can be provided as it may conflict with other parameters.
     * 3. The request's Content-Type must be empty or Form. If it's empty, it can be changed to FormData.
     */
    if (isSupportingPayload(method) && !body && isForm(contentType)) {
      const data = requestParams;
      const hasFile = Object.keys(files).length;
      // If the `files` is not empty, keep the Content-Type header empty, as it will be set by the request library.
      if (!contentType && !hasFile) headers['Content-Type'] = WWW_FORM_URLENCODED;
      const qs = buildQs(staticParams).replace(/^(?=.)/, '?'); // Prepend a "?" if not empty.
      return { method, url: uri + qs, timeout, headers, data, files, ...extensions };
    } else {
      const qs = buildQs({ ...staticParams, ...requestParams }).replace(/^(?=.)/, '?'); // Prepend a "?" if not empty.
      return { method, url: uri + qs, timeout, headers, data: Object(body), files, ...extensions };
    }
  };

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

  /**
   * Specify a timeout in milliseconds.
   */
  public static base?: Settings['base'];

  /**
   * Specify the reqeust headers.
   * @example { Accept: 'application/json' }
   */
  public static headers?: Settings['headers'];

  /**
   * Specify the reqeust base URL.
   */
  public static timeout?: Settings['timeout'];
}
