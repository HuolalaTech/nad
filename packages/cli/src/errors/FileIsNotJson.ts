import { CustomError } from '@huolala-tech/custom-error';
import { I113 } from '../i18n';

export class FileIsNotJson extends CustomError {
  constructor(path: string) {
    super(I113(path));
    this.name = 'FileIsNotJson';
  }
}
