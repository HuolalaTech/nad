import { CustomError } from '@huolala-tech/custom-error';

export class UniqueNameCreatingError extends CustomError {
  constructor(name: string) {
    super(`Faild to create a unique name for '${name}'`);
    this.name = 'UniqueNameCreatingError';
  }
}
