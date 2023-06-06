import { CustomError } from '@huolala-tech/custom-error';
import { I110 } from '../i18n';

export class InvalidURI extends CustomError {
  constructor(url: unknown) {
    super(I110(String(url)));
    this.name = 'InvalidURI';
  }
}
