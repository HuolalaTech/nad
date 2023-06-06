import { CustomError } from '@huolala-tech/custom-error';
import { I112 } from '../i18n';

export class InvalidTarget extends CustomError {
  constructor(target: unknown) {
    super(I112(String(target)));
    this.name = 'InvalidTarget';
  }
}
