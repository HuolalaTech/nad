import { CustomError } from '@huolala-tech/custom-error';

export class NeverReachHere extends CustomError {
  constructor() {
    super(`The code shouldn't reach here anyway`);
    this.name = 'NeverReachHere';
  }
}
