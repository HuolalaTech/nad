import { CustomError } from '@huolala-tech/custom-error';
import { I130, I131, I132 } from '../i18n';

export class FailedToWrite extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'FailedToWrite';
  }
  static wrap(error: Error, path: string): Error {
    const { code } = Object(error);
    switch (code) {
      case 'EROFS':
        return new FailedToWrite(I130(path));
      case 'EISDIR':
        return new FailedToWrite(I131(path));
      case 'EACCES':
        return new FailedToWrite(I132(path));
      default:
        return error;
    }
  }
}
