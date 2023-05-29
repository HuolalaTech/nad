import { CustomError } from '@huolala-tech/custom-error';

export class NeverReachHere extends CustomError {
  constructor(message = `The code shouldn't reach here anyway`) {
    super(message);
    this.name = 'NeverReachHere';
  }
}
