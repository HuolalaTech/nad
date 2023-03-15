import { CustomError } from '@huolala-tech/custom-error';

export class HttpError extends CustomError {
  public status;
  constructor(status: number) {
    super(`HTTP ${status}`);
    this.status = status;
    this.name = 'HttpError';
  }
}
