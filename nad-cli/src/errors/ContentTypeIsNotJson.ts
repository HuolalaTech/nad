import { CustomError } from '@huolala-tech/custom-error';
import { I115 } from '../i18n';
import { AxiosResponse } from 'axios';

export class UnexpectedContentType extends CustomError {
  constructor(actual: string, expect: string, url: string) {
    super(I115(actual, expect, url));
    this.name = 'UnexpectedContentType';
  }

  static assertJson(res: AxiosResponse, url: string) {
    const type = res.headers['content-type'];
    if (!type || !/^application\/json\s*(;|$)/i.test(type)) {
      throw new UnexpectedContentType(type, 'application/json', url);
    }
  }
}
