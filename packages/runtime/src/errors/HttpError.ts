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
    super(`HTTP ${ir.statusCode}`);
    this.raw = ir;
    this.name = 'HttpError';
  }
}
