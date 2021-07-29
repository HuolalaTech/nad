import { EventEmitter } from 'events';

global.FormData = class {
  readonly entries: [string, unknown][] = [];
  forEach(fn: (v: unknown, k: string) => void) {
    this.entries.forEach(([key, value]) => fn(value, key));
  }
  append(key: string, value: unknown) {
    this.entries.push([key, value]);
  }
  toJSON() {
    return Object.fromEntries(this.entries);
  }
} as unknown as typeof FormData;

global.File = class {
  readonly name;
  readonly data;
  constructor(fileBits: BlobPart[], fileName: string) {
    this.data = fileBits;
    this.name = fileName;
  }
} as unknown as typeof File;

global.XMLHttpRequest = class {
  em = new EventEmitter();
  openArgs: unknown[] = [];
  readyState = 0;
  status = 0;
  responseText = '';
  headers: Record<string, string> = {};
  open(...args: unknown[]) {
    this.openArgs = args;
    this.readyState = 1;
  }
  send(body: string | FormData) {
    const files: Record<string, File> = {};
    let data: Record<string, unknown> = {};
    if (typeof body === 'string') {
      try {
        data = JSON.parse(body);
      } catch (_) {
        body.split(/&/g).forEach((pairs) => {
          const m = pairs.match(/(.*?)=(.*)/);
          if (!m) return;
          const [, key, value] = m;
          data[decodeURIComponent(key)] = decodeURIComponent(value);
        });
      }
    } else if (body instanceof FormData) {
      body.forEach((v, k) => {
        if (v instanceof File) {
          files[k] = v;
        } else {
          data[k] = v;
        }
      });
    }
    const { openArgs, headers } = this;
    setTimeout(() => {
      this.readyState = 4;
      this.status = 200;
      this.responseText = JSON.stringify({
        method: openArgs[0],
        url: openArgs[1],
        headers,
        data,
        files,
      });
      this.em.emit('readystatechange');
    });
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
