import { CustomError } from '@huolala-tech/custom-error';
import { I111 } from '../i18n';

export class DirIsNotFile extends CustomError {
  constructor(path: string) {
    super(I111(path));
    this.name = 'DirIsNotFile';
  }
}
