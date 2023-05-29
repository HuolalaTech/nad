import { CustomError } from '@huolala-tech/custom-error';
import { I109 } from '../i18n';

export class MissingField extends CustomError {
  constructor(field: string) {
    super(I109(field));
    this.name = 'MissingField';
  }
}
