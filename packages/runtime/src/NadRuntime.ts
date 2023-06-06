export interface Settings {
  /**
   * Specify a timeout in milliseconds.
   */
  timeout?: number;

  /**
   * Specify the reqeust headers.
   * @example { Accept: 'application/json' }
   */
  headers?: Record<string, string>;

  /**
   * Specify the reqeust base URL.
   */
  base?: string;
}

export type MultipartFile = Blob | File | string;

export interface NadRuntime<T> {
  /**
   * Configure certain necessary parameters.
   *
   * @param method The HTTP method.
   * @param rawPath The raw path, that could contain variable templates such as "/api/users/{id}".
   * @param settings Other settings.
   */
  open(method: string, rawPath: string, settings?: Partial<Settings>): this;

  /**
   * Set a request body, that maps to a Java method parameter which annotated with "@RequestBody".
   *
   * @param body A serializable object.
   */
  addRequestBody(body: unknown): this;

  /**
   * Replace the variable template in the raw path with the real value.
   * In Java code, a parameter which annotated with "@PathVariable" will receive this value.
   *
   * NOTE: An implementation must encoded the value as URL encoding.
   *
   * @param key The variable template name in raw path.
   * @param value The real value.
   */
  addPathVariable(key: string, value: unknown): this;

  /**
   * In Java code, some parameters may be annotated with "@RequestParam".
   * This method set some key-value pairs, that finally map with Java parameters.
   *
   * @param key The variable name.
   * @param value The value.
   */
  addRequestParam(key: string, value: unknown): this;

  /**
   * In Java code, some parameters may be annotated with "@ModelAttribute".
   * This method set an object, that will map with Java parameters.
   *
   * @param param A non-null object.
   */
  addModelAttribute(param: unknown, path: string[]): this;

  /**
   * In Java code, certain parameters may be of the MultipartFile type, which expect to receive a file.
   * This method is used to associate a file object with the key.
   *
   * @param key The field name.
   * @param file A file with a type of either Blob (File extends Blob), or string.
   *
   *             NOTE: In MiniProgram, it is should be a string representing the temporary path.
   */
  addMultipartFile(key: string, file?: MultipartFile | null | undefined): this;

  /**
   * Add a custom request header (HTTP header).
   *
   * @param name The header name.
   * @param value The value.
   */
  addHeader(key: string, value: string): this;

  /**
   * Actually execute this request.
   */
  execute(): Promise<T>;
}
