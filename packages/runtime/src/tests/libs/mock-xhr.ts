import { EventEmitter } from 'events';
import { readAsDataURL } from './readAsDataURL';
import { APPLICATION_JSON, MULTIPART_FORM_DATA } from '@huolala-tech/request';

/**
 * Get a value by a case-insensitive key
 */
const getHeader = <T>(headers: Record<string, T>, name: string) => {
  if (!headers) return undefined;
  const found = Object.entries(headers).find(
    ([key]) => key.localeCompare(name, undefined, { sensitivity: 'accent' }) === 0,
  );
  if (found) return found[1];
  return undefined;
};

global.XMLHttpRequest = class {
  private em = new EventEmitter();
  private openArgs: unknown[] = [];
  private headers: Record<string, string> = {};
  public readyState = 0;
  public status = 0;
  public timeout?: number;
  public responseText = '';
  open(...args: unknown[]) {
    this.openArgs = args;
    this.readyState = 1;
    this.em.emit('readystatechange');
  }
  async send(body: string | FormData) {
    const { openArgs, headers } = this;
    this.readyState = 3;
    this.status = Number(getHeader(headers, 'status-code')) || 200;
    this.em.emit('readystatechange');

    const mockEvent = getHeader(headers, 'event');
    if (mockEvent) {
      this.readyState = 4;
      this.em.emit('readystatechange');
      this.em.emit(mockEvent, new ProgressEvent(mockEvent));
      return;
    }

    const mockResponse = getHeader(headers, 'response-body');
    if (mockResponse) {
      this.readyState = 4;
      this.responseText = mockResponse;
      this.em.emit('readystatechange');
      this.em.emit('load');
      return;
    }

    await Promise.resolve();
    const files: Record<string, string> = {};
    let data: Record<string, unknown> | string | undefined;
    if (typeof body === 'string') {
      try {
        data = JSON.parse(body);
      } catch (error) {
        data = body;
      }
    } else if (body instanceof FormData) {
      if (!Object.keys(this.headers).some((s) => /^Content-Type$/i.test(s))) {
        this.headers['Content-Type'] = `${MULTIPART_FORM_DATA}; boundary=----WebKitFormBoundaryHehehehe`;
      }
      const temp: Record<string, unknown> = {};
      const tasks = Array.from(body, async ([k, v]) => {
        if (v instanceof File) {
          files[k] = await readAsDataURL(v);
        } else {
          temp[k] = v;
        }
      });
      await Promise.all(tasks);
      data = temp;
    }
    await Promise.resolve();
    this.responseText = JSON.stringify({
      method: openArgs[0],
      url: openArgs[1],
      timeout: this.timeout,
      headers,
      data,
      files,
    });
    this.readyState = 4;
    this.em.emit('readystatechange');
    this.em.emit('load');
  }
  addEventListener(e: string, h: () => void) {
    this.em.addListener(e, h);
  }
  setRequestHeader(key: string, value: string) {
    this.headers[key] = value;
  }
  getResponseHeader(key: string) {
    if (key === 'Content-Type') return APPLICATION_JSON;
    return null;
  }
  getAllResponseHeaders() {
    return 'server: mock\r\n';
  }
} as unknown as typeof XMLHttpRequest;
