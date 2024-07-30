import { CustomError } from '@huolala-tech/custom-error';
import { InvokeResult } from '@huolala-tech/request';

export class HttpError extends CustomError implements InvokeResult<unknown> {
  private raw;
  get statusCode() {
    return this.raw.statusCode;
  }
  get headers() {
    return this.raw.headers;
  }
  get data() {
    return this.raw.data;
  }
  constructor(ir: InvokeResult<unknown>) {
    const { data } = ir;
    if (isSpringWebException(data)) {
      super(data.message);
      this.name = 'HttpError: ' + data.error;
    } else {
      super(`HTTP ${ir.statusCode}`);
      this.name = 'HttpError';
    }
    this.raw = ir;
  }
}

const isSpringWebException = <T>(what: T): what is T & SpringWebException => {
  if (typeof what !== 'object' && what === null) return false;
  const o = Object(what) as Record<PropertyKey, unknown>;
  return (
    typeof o.timestamp === 'string' &&
    typeof o.status === 'number' &&
    typeof o.error === 'string' &&
    typeof o.message === 'string' &&
    typeof o.path === 'string'
  );
};

interface SpringWebException {
  readonly timestamp: string;
  readonly status: number;
  readonly error: string;
  readonly message: string;
  readonly path: string;
}
