import { CustomError } from '@huolala-tech/custom-error';

export class HttpError extends CustomError {
  constructor(status: number) {
    super(`HTTP ${status}`);
    this.name = 'HttpError';
  }
}
