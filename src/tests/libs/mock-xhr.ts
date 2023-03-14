import { EventEmitter } from 'events';
import { readAsDataURL } from './readAsDataURL';

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
    this.status = Number(Object(headers)['status-code']) || 200;
    this.em.emit('readystatechange');

    const mockResponse = Object(headers)['response-body'];
    if (mockResponse) {
      this.readyState = 4;
      this.responseText = mockResponse;
      this.em.emit('readystatechange');
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
    this.readyState = 4;
    this.responseText = JSON.stringify({
      method: openArgs[0],
      url: openArgs[1],
      timeout: this.timeout,
      headers,
      data,
      files,
    });
    this.em.emit('readystatechange');
  }
  addEventListener(e: string, h: () => void) {
    this.em.addListener(e, h);
  }
  setRequestHeader(key: string, value: string) {
    this.headers[key] = value;
  }
  getResponseHeader(key: string) {
    if (key === 'Content-Type') return 'application/json';
    return null;
  }
  getAllResponseHeaders() {
    return 'server: mock\r\n';
  }
} as unknown as typeof XMLHttpRequest;
