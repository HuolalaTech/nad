import { CustomError } from '@huolala-tech/custom-error';

export class ObjectNestingTooDeepError extends CustomError {
  constructor() {
    super('The object is nesting too deep');
  }
}
