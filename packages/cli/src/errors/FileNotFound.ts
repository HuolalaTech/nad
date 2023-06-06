import { CustomError } from '@huolala-tech/custom-error';
import { I114 } from '../i18n';

export class FileNotFound extends CustomError {
  constructor(path: string) {
    super(I114(path));
    this.name = 'FileNotFound';
  }
}
