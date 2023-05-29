import { CustomError } from '@huolala-tech/custom-error';
import { I107 } from '../i18n';

export class UnknownOption extends CustomError {
  constructor(name: string) {
    super(I107(name));
    this.name = 'UnknownOption';
  }
}
